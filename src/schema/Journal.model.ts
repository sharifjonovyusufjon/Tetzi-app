import mongoose, { Schema } from "mongoose";
import { JournalStatus } from "../libs/enums/journal.enum";

const journalSchema = new Schema(
  {
    journalStatus: {
      type: String,
      enum: JournalStatus,
      default: JournalStatus.PAUSE,
    },

    journalTitle: {
      type: String,
      required: true,
    },

    journalContext: {
      type: String,
      required: true,
    },

    journalImage: {
      type: String,
    },

    journalComments: {
      type: Number,
      default: 0,
    },

    journalLikes: {
      type: Number,
      default: 0,
    },

    journalViews: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Journal", journalSchema);
