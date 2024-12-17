import { Router } from "express";
import memberController from "./controllers/member.controller";
const router = Router();

router.get("/signup", memberController.signup);

router.get("/login", memberController.login);

export default router;
