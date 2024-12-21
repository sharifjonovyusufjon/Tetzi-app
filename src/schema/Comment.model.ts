import mongoose, { Schema } from "mongoose";
import { CommentGroup } from "../libs/enums/comment.enum";

const commentSchema = new Schema(
  {
    commentGroup: {
      type: String,
      enum: CommentGroup,
    },

    commentContext: {
      type: String,
      required: true,
    },

    memberId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Member",
    },

    commentRefId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Comment", commentSchema);
