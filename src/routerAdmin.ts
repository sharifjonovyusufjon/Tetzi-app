import { Router } from "express";
import adminController from "./controllers/admin.controller";
const routerAdmin = Router();

routerAdmin.get("/", adminController.goHome);

routerAdmin.get("/signup", adminController.goSignup);

routerAdmin.get("/login", adminController.goLogin);

export default routerAdmin;
