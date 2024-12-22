import { ObjectId } from "mongoose";
import { CommentGroup } from "../enums/comment.enum";

export interface CommentInput {
  commentGroup: CommentGroup;
  commentContext: string;
  memberId: ObjectId;
  commentRefId: ObjectId;
}

export interface Comment {
  commentGroup: CommentGroup;
  commentContext: string;
  memberId: ObjectId;
  commentRefId: ObjectId;
}
