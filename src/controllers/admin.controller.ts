import MemberService from "../models/Member.service";
import { T } from "../libs/types/common";
import { Request, Response } from "express";
import { MemberInput } from "../libs/types/member";
import { Member } from "../libs/types/member";
import { MemberType } from "../libs/enums/member.enum";

const adminController: T = {};
const memberService = new MemberService();

adminController.goHome = (req: Request, res: Response) => {
  try {
    console.log("goHome");
    res.send("goHome");
  } catch (err) {
    console.log("Error, goHome:", err);
  }
};

adminController.goSignup = (req: Request, res: Response) => {
  try {
    console.log("goSignup");
    res.send("goSignup");
  } catch (err) {
    console.log("Error, goSignup:", err);
  }
};

adminController.goLogin = (req: Request, res: Response) => {
  try {
    console.log("goLogin");
    res.send("goLogin");
  } catch (err) {
    console.log("Error, goLogin:", err);
  }
};

adminController.processSignup = async (req: Request, res: Response) => {
  try {
    console.log("processSignup");
    const newMember: MemberInput = req.body;
    newMember.memberType = MemberType.ADMIN;
    const result: Member = await memberService.processSignup(newMember);
    res.json({ member: result });
  } catch (err) {
    console.log("Error, processSignup:", err);
  }
};

adminController.processLogin = (req: Request, res: Response) => {
  try {
    console.log("processLogin");
    res.send("processLogin");
  } catch (err) {
    console.log("Error, processLogin:", err);
  }
};

export default adminController;
