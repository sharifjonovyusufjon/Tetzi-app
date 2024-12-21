import Errors, { HttpCode, Message } from "../libs/Errors";
import {
  Journal,
  JournalInput,
  UpdateJournalInput,
} from "../libs/types/journal";
import JournalModel from "../schema/Journal.model";
import ViewService from "./View.service";

class JournalService {
  private readonly journalModel;
  private readonly viewService;
  constructor() {
    this.journalModel = JournalModel;
    this.viewService = new ViewService();
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
