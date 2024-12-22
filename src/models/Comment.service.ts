import { CommentGroup } from "../libs/enums/comment.enum";
import Errors, { HttpCode, Message } from "../libs/Errors";
import { Comment, CommentInput } from "../libs/types/comment";
import CommentModel from "../schema/Comment.model";
import { ObjectId } from "mongoose";
import ProductService from "./Product.service";
import JournalService from "./Journal.service";

class CommentService {
  private readonly commentModel;
  private readonly productService;
  private readonly journalService;
  constructor() {
    this.commentModel = CommentModel;
    this.productService = new ProductService();
    this.journalService = new JournalService();
  }

  public async createComment(input: CommentInput): Promise<Comment> {
    try {
      const result: Comment = await this.commentModel.create(input);
      console.log(input.commentGroup);
      if (input.commentGroup === CommentGroup.PRODUCT) {
        await this.productService.productStatisEditor({
          _id: result.commentRefId,
          targetKey: "productComments",
          modifier: 1,
        });
      }

      if (input.commentGroup === CommentGroup.JOURNAL) {
        await this.journalService.journalStatisEditor({
          _id: input.commentRefId,
          targetKey: "journalComments",
          modifier: 1,
        });
      }

      return result;
    } catch (err) {
      console.log("Error, createComment:", err);
      throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
    }
  }

  /* ====================== ADMIN ======================= */
  public async getAllComment(): Promise<Comment[]> {
    const result = await this.commentModel.find().exec();
    return result.length ? result : [];
  }

  public async removeComment(commentId: ObjectId): Promise<Comment> {
    const result = await this.commentModel.findByIdAndRemove(commentId).exec();
    if (!result)
      throw new Errors(HttpCode.INTERNAL_SERVER_ERROR, Message.UPDATE_FAILED);
    return result;
  }
}

export default CommentService;
