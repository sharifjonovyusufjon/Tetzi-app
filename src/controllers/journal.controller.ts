import { Request, Response } from "express";
import { T } from "../libs/types/common";
import { AdminRequest, ExtendedRequest } from "../libs/types/member";
import Errors, { HttpCode, Message } from "../libs/Errors";
import {
  JournalInput,
  JournalInQuiry,
  UpdateJournalInput,
} from "../libs/types/journal";
import JournalService from "../models/Journal.service";
import { shapeIntoMongooseObjectId } from "../libs/config";

const journalController: T = {};
const journalService = new JournalService();

journalController.getJournal = async (req: ExtendedRequest, res: Response) => {
  try {
    console.log("getJournal");
    let memberId;
    if (req.member === undefined) {
      memberId = null;
    } else {
      memberId = shapeIntoMongooseObjectId(req.member._id);
    }

    console.log("memberid:", memberId);
    const journalId = shapeIntoMongooseObjectId(req.params.id);
    const result = await journalService.getJournal(memberId, journalId);
    res.json({ product: result });
  } catch (err) {
    console.log("Error, getJournal:", err);
    res.send(err);
  }
};

journalController.getJournals = async (req: ExtendedRequest, res: Response) => {
  try {
    console.log("getJournals");
    const { page, limit, search } = req.query;

    const input: JournalInQuiry = {
      page: Number(page),
      limit: Number(limit),
      search: {},
    };

    let memberId;
    if (req.member === undefined) {
      memberId = null;
    } else {
      memberId = shapeIntoMongooseObjectId(req.member._id);
    }

    const result = await journalService.getJournals(memberId, input);
    res.json(result);
  } catch (err) {
    console.log("Error, getJournals:", err);
    res.send(err);
  }
};

/* ================= ADMIN ===================== */

journalController.createJournal = async (req: AdminRequest, res: Response) => {
  try {
    console.log("createJournal");
    if (!req.file)
      throw new Errors(HttpCode.INTERNAL_SERVER_ERROR, Message.CREATE_FAILED);

    const input: JournalInput = req.body;
    input.journalImage = req.file.path.replace(/\\/g, "/");

    const result = await journalService.createJournal(input);
    res.json({ journal: result });
  } catch (err) {
    console.log("Error, createJournal:", err);
    res.send(err);
  }
};

journalController.updateJournal = async (req: Request, res: Response) => {
  try {
    console.log("updateJournal");
    console.log("id", req.params.id);
    const input: UpdateJournalInput = req.body;
    input._id = shapeIntoMongooseObjectId(req.params.id);
    const result = await journalService.updateJournal(input);
    res.json({ journal: result });
  } catch (err) {
    console.log("Error, updateJournal:", err);
    res.send(err);
  }
};

journalController.getAllJournal = async (req: Request, res: Response) => {
  try {
    console.log("getAllProduct");
    const result = await journalService.getAllJournal();
    res.json({ journal: result });
  } catch (err) {
    console.log("Error, getAllJournal:", err);
    res.send(err);
  }
};

export default journalController;
