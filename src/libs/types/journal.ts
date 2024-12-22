import { JournalCategory, JournalStatus } from "../enums/journal.enum";
import { ObjectId } from "mongoose";

export interface JournalInput {
  journalStatus: JournalStatus;
  journalTitle: string;
  journalContext: string;
  journalImage?: string;
  journalCategory: JournalCategory;
}

export interface Journal {
  _id: ObjectId;
  journalStatus: JournalStatus;
  journalCategory: JournalCategory;
  journalTitle: string;
  journalContext: string;
  journalImage?: string;
  journalComments: number;
  journalLikes: number;
  journalViews: number;
  createdAt?: Date;
  updatedAt?: Date;

  /* from aggregate */
  journalData?: [Comment];
}

export interface UpdateJournalInput {
  _id: ObjectId;
  journalStatus?: JournalStatus;
  journalCategory?: JournalCategory;
  journalTitle?: string;
  journalContext?: string;
  journalImage?: string;
}

export interface AllSearchJournal {
  text?: string;
  journalCategory?: JournalCategory;
}

export interface JournalInQuiry {
  page: number;
  limit: number;
  search: AllSearchJournal;
}
