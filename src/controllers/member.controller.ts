import MemberService from "../models/Member.service";
import { T } from "../libs/types/common";
import { NextFunction, Request, Response } from "express";
import {
  ExtendedRequest,
  LoginInput,
  Member,
  MemberInput,
  UpdateMemberInput,
} from "../libs/types/member";
import AuthService from "../models/Auth.service";
import { AUTH_TIMER, shapeIntoMongooseObjectId } from "../libs/config";
import Errors, { HttpCode, Message } from "../libs/Errors";

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

memberController.logout = (req: ExtendedRequest, res: Response) => {
  try {
    console.log("logout");
    res.cookie("access", null, { maxAge: 0, httpOnly: true });
    res.json({ logout: true });
  } catch (err) {
    console.log("Error, logout:", err);
    res.send(err);
  }
};

// verifyAuth
memberController.verifyAuth = async (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("verifyAuth");
    const token = req.cookies["accessToken"];
    if (token) req.member = await authService.checkAuth(token);

    if (!req.member) {
      throw new Errors(HttpCode.UNAUTHORIZED, Message.NOT_AUNTiCANTED);
    }
    next();
  } catch (err) {
    console.log("Error, verifyAuth:", err);
    res.send(err);
  }
};

// retriewAuth
memberController.retriewAuth = async (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("retriewAuth");
    const token = req.cookies["accessToken"];
    if (token) req.member = await authService.checkAuth(token);

    next();
  } catch (err) {
    console.log("Error, retriewAuth:", err);
    res.send(err);
  }
};

memberController.getAdmin = async (req: Request, res: Response) => {
  try {
    console.log("getAdmin");
    const result = await memberService.getAdmin();
    res.json({ member: result });
  } catch (err) {
    console.log("Error, getAdmin:", err);
    res.send(err);
  }
};

memberController.memberDetail = async (req: ExtendedRequest, res: Response) => {
  try {
    console.log("memberDetail");
    const result = await memberService.memberDetail(req.member._id);
    res.json({ member: result });
  } catch (err) {
    console.log("Error, memberDetail:", err);
    res.send(err);
  }
};

memberController.memberUpdate = async (req: ExtendedRequest, res: Response) => {
  try {
    console.log("memberUpdate");

    if (!req.file)
      throw new Errors(HttpCode.INTERNAL_SERVER_ERROR, Message.CREATE_FAILED);

    const input: UpdateMemberInput = req.body;
    input.memberImage = req.file.path.replace(/\\/g, "/");

    const result = await memberService.memberUpdate(req.member._id, input);
    res.json({ member: result });
  } catch (err) {
    console.log("Error, memberDetail:", err);
    res.send(err);
  }
};

export default memberController;
