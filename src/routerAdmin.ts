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

/* ADMIN PRODUCT */

/* ADMIN USER */
export default routerAdmin;
