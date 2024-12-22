import { Request, Response } from "express";
import { T } from "../libs/types/common";
import CommentService from "../models/Comment.service";
import { ExtendedRequest } from "../libs/types/member";
import { CommentInput } from "../libs/types/comment";
import { shapeIntoMongooseObjectId } from "../libs/config";
import Errors from "../libs/Errors";

const commentController: T = {};
const commentService = new CommentService();

commentController.createComment = async (
  req: ExtendedRequest,
  res: Response
) => {
  try {
    console.log("createComment");
    const input: CommentInput = req.body;
    input.memberId = req.member._id;
    input.commentRefId = shapeIntoMongooseObjectId(input.commentRefId);
    const result = await commentService.createComment(input);
    res.json({ comment: result });
  } catch (err) {
    console.log("Error, createComment:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standart.code).json(Errors.standart);
  }
};

/* ====================== ADMIN ======================= */

commentController.getAllComment = async (req: Request, res: Response) => {
  try {
    console.log("getAllComment");
    const result = await commentService.getAllComment();
    res.json({ comment: result });
  } catch (err) {
    console.log("Error, getAllComment:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standart.code).json(Errors.standart);
  }
};

commentController.removeComment = async (req: Request, res: Response) => {
  try {
    console.log("removeComment");
    const commentId = shapeIntoMongooseObjectId(req.params.id);
    const result = await commentService.removeComment(commentId);
    res.json({ comment: result });
  } catch (err) {
    console.log("Error, removeComment:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standart.code).json(Errors.standart);
  }
};

export default commentController;
