import { Router } from "express";
import memberController from "./controllers/member.controller";
import productController from "./controllers/product.controller";
import journalController from "./controllers/journal.controller";
import makeUploader from "./libs/utils/uploader";
import commentController from "./controllers/comment.controller";
import orderController from "./controllers/order.controller";
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
  makeUploader("members").single("memberImage"),
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

router.get(
  "/journal/:id",
  memberController.retriewAuth,
  journalController.getJournal
);

/* ORDER */

router.post(
  "/order/create",
  memberController.verifyAuth,
  orderController.createOrder
);

router.get(
  "/order/all",
  memberController.verifyAuth,
  orderController.getMyOrders
);

router.post(
  "/order/update",
  memberController.verifyAuth,
  orderController.updateOrder
);

/* COMMENT */

router.post(
  "/comment/create",
  memberController.verifyAuth,
  commentController.createComment
);

export default router;
