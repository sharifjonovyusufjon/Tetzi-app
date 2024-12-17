import { T } from "../libs/types/common";
import { Request, Response } from "express";

const memberController: T = {};

memberController.signup = (req: Request, res: Response) => {
  try {
    res.send("signup");
  } catch (err) {
    console.log("Error, signup:", err);
  }
};

memberController.login = (req: Request, res: Response) => {
  try {
    res.send("login");
  } catch (err) {
    console.log("Error, login:", err);
  }
};

export default memberController;
