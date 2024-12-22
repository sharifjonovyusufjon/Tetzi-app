import Errors, { HttpCode, Message } from "../libs/Errors";
import { Comment, CommentInput } from "../libs/types/comment";
import CommentModel from "../schema/Comment.model";
import { ObjectId } from "mongoose";

class CommentService {
  private readonly commentModel;
  constructor() {
    this.commentModel = CommentModel;
  }

  public async createComment(input: CommentInput): Promise<Comment> {
    try {
      return await this.commentModel.create(input);
    } catch (err) {
      console.log("Error, createComment:", err);
      throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
    }
  }
}

export default CommentService;
