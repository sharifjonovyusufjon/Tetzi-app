import { JournalStatus } from "../enums/journal.enum";
import { ObjectId } from "mongoose";

export interface JournalInput {
  journalStatus: JournalStatus;
  journalTitle: string;
  journalContext: string;
  journalImage?: string;
}

export interface Journal {
  _id: ObjectId;
  journalStatus: JournalStatus;
  journalTitle: string;
  journalContext: string;
  journalImage?: string;
  journalComments: number;
  journalLikes: number;
  journalViews: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UpdateJournalInput {
  _id?: ObjectId;
  journalStatus?: JournalStatus;
  journalTitle?: string;
  journalContext?: string;
  journalImage?: string;
}
