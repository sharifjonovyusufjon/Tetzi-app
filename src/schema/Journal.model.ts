import mongoose, { Schema } from "mongoose";
import { JournalCategory, JournalStatus } from "../libs/enums/journal.enum";

const journalSchema = new Schema(
  {
    journalStatus: {
      type: String,
      enum: JournalStatus,
      default: JournalStatus.PAUSE,
    },

    journalCategory: {
      type: String,
      enum: JournalCategory,
    },

    journalTitle: {
      type: String,
      index: { unique: true, sparse: true },
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
