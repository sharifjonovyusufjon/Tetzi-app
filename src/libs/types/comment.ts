import { ObjectId } from "mongoose";
import { CommentGroup } from "../enums/comment.enum";
import { Member } from "./member";

export interface CommentInput {
  commentGroup: CommentGroup;
  commentContext: string;
  memberId: ObjectId;
  commentRefId: ObjectId;
}

export interface Comment {
  _id: ObjectId;
  commentGroup: CommentGroup;
  commentContext: string;
  memberId: ObjectId;
  commentRefId: ObjectId;
  memberData?: Member;
}
