import { Router } from "express";
import memberController from "./controllers/member.controller";
const router = Router();

router.post("/signup", memberController.signup);

router.post("/login", memberController.login);

router.get("/logout", memberController.logout);

router.get("/verify", memberController.verifyAuth);

router.get("/retriew", memberController.retriewAuth);

export default router;
