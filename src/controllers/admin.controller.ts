import { T } from "../libs/types/common";
import { Request, Response } from "express";

const adminController: T = {};

adminController.goHome = (req: Request, res: Response) => {
  try {
    res.send("goHome");
  } catch (err) {
    console.log("Error, goHome:", err);
  }
};

adminController.goSignup = (req: Request, res: Response) => {
  try {
    res.send("goSignup");
  } catch (err) {
    console.log("Error, goSignup:", err);
  }
};

adminController.goLogin = (req: Request, res: Response) => {
  try {
    res.send("goLogin");
  } catch (err) {
    console.log("Error, goLogin:", err);
  }
};

export default adminController;
