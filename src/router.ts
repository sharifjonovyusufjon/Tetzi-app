import { Router } from "express";
import memberController from "./controllers/member.controller";
import productController from "./controllers/product.controller";
import journalController from "./controllers/journal.controller";
const router = Router();

router.post("/member/signup", memberController.signup);

router.post("/member/login", memberController.login);

router.get("/member/logout", memberController.logout);

router.get("/member/verify", memberController.verifyAuth);

router.get("/member/retriew", memberController.retriewAuth);

/* MEMBER */

router.get("/member/admin", memberController.getAdmin);

router.get(
  "/member/detail",
  memberController.verifyAuth,
  memberController.memberDetail
);

router.post(
  "/member/update",
  memberController.verifyAuth,
  memberController.memberUpdate
);

/* PRODUCT */

router.get(
  "/product/all",
  memberController.retriewAuth,
  productController.getProducts
);

router.get(
  "/product/sellers",
  memberController.retriewAuth,
  productController.getBestSeller
);

router.get(
  "/product/:id",
  memberController.retriewAuth,
  productController.getProduct
);

/* JOURNAL */

router.get(
  "/journal/all",
  memberController.retriewAuth,
  journalController.getJournals
);

export default router;
