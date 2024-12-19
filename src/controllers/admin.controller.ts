import MemberService from "../models/Member.service";
import { T } from "../libs/types/common";
import { NextFunction, Request, Response } from "express";
import { AdminRequest, LoginInput, MemberInput } from "../libs/types/member";
import { Member } from "../libs/types/member";
import { MemberType } from "../libs/enums/member.enum";
import Errors, { HttpCode, Message } from "../libs/Errors";

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

adminController.processSignup = async (req: AdminRequest, res: Response) => {
  try {
    console.log("processSignup");
    const newMember: MemberInput = req.body;
    newMember.memberType = MemberType.ADMIN;
    const result: Member = await memberService.processSignup(newMember);

    req.session.member = result;
    req.session.save(function () {
      res.json({ member: result });
    });
  } catch (err) {
    console.log("Error, processSignup:", err);
    res.send(err);
  }
};

adminController.processLogin = async (req: AdminRequest, res: Response) => {
  try {
    console.log("processLogin");
    const member: LoginInput = req.body;
    const result: Member = await memberService.processLogin(member);
    req.session.member = result;
    req.session.save(function () {
      res.json({ member: result });
    });
  } catch (err) {
    console.log("Error, processLogin:", err);
    res.send(err);
  }
};

adminController.processLogout = async (req: AdminRequest, res: Response) => {
  try {
    console.log("processLogout");
    req.session.destroy(function () {
      res.json({ processLogout: true });
    });
  } catch (err) {
    console.log("Error, processLogout:", err);
    res.send(err);
  }
};

adminController.checkAdmin = async (req: AdminRequest, res: Response) => {
  try {
    console.log("checkAdmin");
    if (req.session?.member) {
      res.send(`Your email: ${req.session.member.memberEmail}`);
    } else res.send(Message.NOT_AUNTiCANTED);
  } catch (err) {
    console.log("Error, checkAdmin:", err);
    res.send(err);
  }
};

adminController.verifyAdmin = async (
  req: AdminRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("verifyAdmin");
    if (req.session?.member.memberType === MemberType.ADMIN) {
      next();
    } else res.send(Message.NOT_AUNTiCANTED);
  } catch (err) {
    console.log("Error, verifyAdmin:", err);
    res.send(err);
  }
};

/* member */

adminController.getAllMember = async (req: Request, res: Response) => {
  try {
    console.log("getAllMember");
    const result: Member[] = await memberService.getAllMember();
    res.json({ members: result });
  } catch (err) {
    console.log("Error, getAllMember:", err);
    res.send(err);
  }
};

adminController.updateMember = async (req: Request, res: Response) => {
  try {
    console.log("updateMember");
    const result = await memberService.updateMember(req.body);
    res.json({ member: result });
  } catch (err) {
    console.log("Error, updateMember:", err);
    res.send(err);
  }
};

export default adminController;
