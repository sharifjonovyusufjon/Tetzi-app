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
import { ViewInput } from "../libs/types/view";
import { ViewGroup } from "../libs/enums/view.num";
import { StatatisEditor } from "../libs/config";
import MemberService from "./Member.service";

class JournalService {
  private readonly journalModel;
  private readonly viewService;
  private readonly memberService;
  constructor() {
    this.journalModel = JournalModel;
    this.viewService = new ViewService();
    this.memberService = new MemberService();
  }

  public async getJournal(
    memberId: ObjectId | null,
    journalId: ObjectId
  ): Promise<Journal> {
    const match: T = { _id: journalId, journalStatus: JournalStatus.PROCESS };
    const journalTarget = await this.journalModel
      .aggregate([
        { $match: match },
        {
          $lookup: {
            from: "comments",
            localField: "_id",
            foreignField: "commentRefId",
            as: "journalData",
          },
        },
      ])
      .exec();
    console.log("journalT", journalTarget);
    if (!journalTarget.length)
      throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

    if (memberId) {
      const viewInput: ViewInput = {
        viewGroup: ViewGroup.PRODUCT,
        memberId: memberId,
        viewRefId: journalId,
      };
      const newView = await this.viewService.checkView(viewInput);
      if (newView) {
        this.journalStatisEditor({
          _id: journalId,
          targetKey: "journalViews",
          modifier: 1,
        });

        journalTarget[0].journalViews++;
      }
    }

    const comment = journalTarget[0].journalData;
    const data = await Promise.all(
      comment.map(async (ele: any) => {
        const memberData = await this.memberService.memberDetail(ele.memberId);
        ele.memberData = memberData;
        return ele;
      })
    );

    return journalTarget[0];
  }

  public async journalStatisEditor(input: StatatisEditor): Promise<void> {
    const { _id, targetKey, modifier } = input;
    return await this.journalModel
      .findByIdAndUpdate(
        _id,
        { $inc: { [targetKey]: modifier } },
        { new: true }
      )
      .exec();
  }

  public async getJournals(
    memberId: ObjectId,
    input: JournalInQuiry
  ): Promise<Journal[]> {
    const { page, limit, search } = input;

    const match: T = { journalStatus: JournalStatus.PROCESS };
    const sort: T = { createdAt: -1 };
    if (search) match.journalTitle = { $regex: new RegExp(search, "i") };

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
