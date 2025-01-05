import MemberService from "../models/Member.service";
import { T } from "../libs/types/common";
import { NextFunction, Request, Response } from "express";
import { AdminRequest, LoginInput, MemberInput } from "../libs/types/member";
import { Member } from "../libs/types/member";
import { MemberState, MemberType } from "../libs/enums/member.enum";
import Errors, { HttpCode, Message } from "../libs/Errors";

const adminController: T = {};
const memberService = new MemberService();

adminController.goHome = (req: Request, res: Response) => {
  try {
    console.log("goHome");
    res.render("home");
  } catch (err) {
    console.log("Error, goHome:", err);
    const message =
      err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG;
    res.send(`<script> alert("${message}")</script>`);
  }
};

adminController.goSignup = (req: Request, res: Response) => {
  try {
    console.log("goSignup");
    res.render("signup");
  } catch (err) {
    console.log("Error, goSignup:", err);
    const message =
      err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG;
    res.send(`<script> alert("${message}")</script>`);
  }
};

adminController.goLogin = (req: Request, res: Response) => {
  try {
    console.log("goLogin");
    res.render("login");
  } catch (err) {
    console.log("Error, goLogin:", err);
    const message =
      err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG;
    res.send(`<script> alert("${message}")</script>`);
  }
};

adminController.processSignup = async (req: AdminRequest, res: Response) => {
  try {
    console.log("processSignup");
    const newMember: MemberInput = req.body;
    newMember.memberImage = req.file.path.replace(/\\/g, "/");
    newMember.memberType = MemberType.ADMIN;
    newMember.memberState = MemberState.SEOUL;
    const result: Member = await memberService.processSignup(newMember);

    req.session.member = result;
    req.session.save(function () {
      res.redirect("/admin");
    });
  } catch (err) {
    console.log("Error, processSignup:", err);
    const message =
      err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG;
    res.send(`<script> alert("${message}")</script>`);
  }
};

adminController.processLogin = async (req: AdminRequest, res: Response) => {
  try {
    console.log("processLogin");
    const member: LoginInput = req.body;
    const result: Member = await memberService.processLogin(member);
    req.session.member = result;
    req.session.save(function () {
      res.redirect("/admin");
    });
  } catch (err) {
    console.log("Error, processLogin:", err);
    const message =
      err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG;
    res.send(`<script> alert("${message}")</script>`);
  }
};

adminController.processLogout = async (req: AdminRequest, res: Response) => {
  try {
    console.log("processLogout");
    req.session.destroy(function () {
      res.redirect("/admin");
    });
  } catch (err) {
    console.log("Error, processLogout:", err);
    const message =
      err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG;
    res.send(`<script> alert("${message}")</script>`);
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
    const message =
      err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG;
    res.send(`<script> alert("${message}")</script>`);
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
    const message =
      err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG;
    res.send(`<script> alert("${message}")</script>`);
  }
};

/* member */

adminController.getAllMember = async (req: Request, res: Response) => {
  try {
    console.log("getAllMember");
    const result: Member[] = await memberService.getAllMember();
    res.render("users", { users: result });
  } catch (err) {
    console.log("Error, getAllMember:", err);
    const message =
      err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG;
    res.send(`<script> alert("${message}")</script>`);
  }
};

adminController.updateMember = async (req: Request, res: Response) => {
  try {
    console.log("updateMember");
    const result = await memberService.updateMember(req.body);
    res.json({ member: result });
  } catch (err) {
    console.log("Error, updateMember:", err);
    const message =
      err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG;
    res.send(`<script> alert("${message}")</script>`);
  }
};

export default adminController;
