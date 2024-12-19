import { Router } from "express";
import memberController from "./controllers/member.controller";
const router = Router();

router.post("/member/signup", memberController.signup);

router.post("/member/login", memberController.login);

router.get("/member/logout", memberController.logout);

router.get("/member/verify", memberController.verifyAuth);

router.get("/member/retriew", memberController.retriewAuth);

/* MEMBER */

router.get(
  "/member/detail",
  memberController.verifyAuth,
  memberController.memberDetail
);

/* PRODUCT */

export default router;
