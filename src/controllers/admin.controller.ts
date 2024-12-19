import MemberService from "../models/Member.service";
import { T } from "../libs/types/common";
import { Request, Response } from "express";

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

adminController.processSignup = (req: Request, res: Response) => {
  try {
    console.log("processSignup");
    res.send("processSignup");
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
