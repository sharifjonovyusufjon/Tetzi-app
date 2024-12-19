import { Router } from "express";
import adminController from "./controllers/admin.controller";
const routerAdmin = Router();

/* ADMIN */
routerAdmin.get("/", adminController.goHome);

routerAdmin
  .get("/signup", adminController.goSignup)
  .post("/signup", adminController.processSignup);

routerAdmin
  .get("/login", adminController.goLogin)
  .post("/login", adminController.processLogin);

routerAdmin.get("/logout", adminController.processLogout);
routerAdmin.get("/checkAdmin", adminController.checkAdmin);
routerAdmin.get("/verifyAdmin", adminController.verifyAdmin);

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
