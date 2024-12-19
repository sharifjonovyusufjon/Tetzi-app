import MemberService from "../models/Member.service";
import { T } from "../libs/types/common";
import { Request, Response } from "express";
import { LoginInput, Member, MemberInput } from "../libs/types/member";

const memberController: T = {};
const memberService = new MemberService();

memberController.signup = async (req: Request, res: Response) => {
  try {
    console.log("signup");
    const newMember: MemberInput = req.body;
    const result: Member = await memberService.signup(newMember);
    res.json({ member: result });
  } catch (err) {
    console.log("Error, signup:", err);
    res.send(err);
  }
};

memberController.login = async (req: Request, res: Response) => {
  try {
    console.log("login");
    const member: LoginInput = req.body;
    const result: Member = await memberService.login(member);
    res.json({ member: result });
  } catch (err) {
    console.log("Error, login:", err);
    res.send(err);
  }
};

export default memberController;
