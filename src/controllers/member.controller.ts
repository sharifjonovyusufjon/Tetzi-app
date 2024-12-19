import MemberService from "../models/Member.service";
import { T } from "../libs/types/common";
import { Request, Response } from "express";
import { LoginInput, Member, MemberInput } from "../libs/types/member";
import AuthService from "../models/Auth.service";
import { AUTH_TIMER } from "../libs/config";

const memberController: T = {};
const memberService = new MemberService();
const authService = new AuthService();

memberController.signup = async (req: Request, res: Response) => {
  try {
    console.log("signup");
    const newMember: MemberInput = req.body;
    const result: Member = await memberService.signup(newMember);

    const token = await authService.createToken(result);
    res.cookie("accessToken", token, {
      maxAge: AUTH_TIMER * 3600 * 1000,
      httpOnly: false,
    });

    res.json({ member: result, accessToken: token });
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

    const token = await authService.createToken(result);
    res.cookie("accessToken", token, {
      maxAge: AUTH_TIMER * 3600 * 1000,
      httpOnly: false,
    });

    res.json({ member: result, accessToken: token });
  } catch (err) {
    console.log("Error, login:", err);
    res.send(err);
  }
};

export default memberController;
