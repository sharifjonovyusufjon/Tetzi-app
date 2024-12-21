import { T } from "../libs/types/common";
import Errors, { HttpCode, Message } from "../libs/Errors";
import {
  Journal,
  JournalInput,
  JournalInQuiry,
  UpdateJournalInput,
} from "../libs/types/journal";
import JournalModel from "../schema/Journal.model";
import ViewService from "./View.service";
import { JournalStatus } from "../libs/enums/journal.enum";
import { ObjectId } from "mongoose";

class JournalService {
  private readonly journalModel;
  private readonly viewService;
  constructor() {
    this.journalModel = JournalModel;
    this.viewService = new ViewService();
  }

  public async getJournals(
    memberId: ObjectId,
    input: JournalInQuiry
  ): Promise<Journal[]> {
    const { page, limit, search } = input;
    const { text, journalCategory } = input.search;

    const match: T = { journalStatus: JournalStatus.PROCESS };
    const sort: T = { createdAt: -1 };

    if (journalCategory) match.journalCategory = journalCategory;
    if (text) match.journalTitle = { $regex: new RegExp(text, "i") };

    const result = await this.journalModel
      .aggregate([
        { $match: match },
        { $sort: sort },
        { $skip: (input.page - 1) * input.limit },
        { $limit: input.limit },
      ])
      .exec();

    return result.length ? result : [];
  }

  /* ------- ADMIN ------ */

  public async createJournal(input: JournalInput): Promise<Journal> {
    try {
      const result: Journal = await this.journalModel.create(input);
      if (!result)
        throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);

      return result;
    } catch (err) {
      console.log("Error, createJournal:", err);
      throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
    }
  }

  public async updateJournal(input: UpdateJournalInput): Promise<Journal> {
    const result = await this.journalModel
      .findByIdAndUpdate(input._id, input, { new: true })
      .exec();
    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

    return result;
  }

  public async getAllJournal(): Promise<Journal[]> {
    const result = await this.journalModel.find().exec();
    return result.length ? result : [];
  }
}

export default JournalService;
