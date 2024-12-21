import { ViewGroup } from "../enums/view.num";
import { ObjectId } from "mongoose";

export interface ViewInput {
  viewGroup: ViewGroup;
  memberId: ObjectId;
  viewRefId: ObjectId;
}

export interface View {
  _id: ObjectId;
  viewGroup: ViewGroup;
  memberId: ObjectId;
  viewRefId: ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}
