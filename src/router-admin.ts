import { Router } from "express";
import adminController from "./controllers/admin.controller";
const routerAdmin = Router();

/* ADMIN */
routerAdmin.get("/", adminController.goHome);

routerAdmin
  .get("/member/signup", adminController.goSignup)
  .post("/member/signup", adminController.processSignup);

routerAdmin
  .get("/member/login", adminController.goLogin)
  .post("/member/login", adminController.processLogin);

routerAdmin.get("/member/logout", adminController.processLogout);
routerAdmin.get("/member/checkAdmin", adminController.checkAdmin);
routerAdmin.get("/member/verifyAdmin", adminController.verifyAdmin);

/* ADMIN MEMBER */
routerAdmin.get(
  "/member/all",
  adminController.verifyAdmin,
  adminController.getAllMember
);
routerAdmin.post(
  "/member/update",
  adminController.verifyAdmin,
  adminController.updateMember
);

/* ADMIN PRODUCT */

export default routerAdmin;
