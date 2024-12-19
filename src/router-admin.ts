import { Router } from "express";
import adminController from "./controllers/admin.controller";
import makeUploader from "./libs/utils/uploader";
import productController from "./controllers/product.controller";
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

routerAdmin.post(
  "/product/create",
  adminController.verifyAdmin,
  makeUploader("products").array("productImages", 5),
  productController.createProduct
);

routerAdmin.post(
  "/product/update/:id",
  adminController.verifyAdmin,
  productController.updateProduct
);

export default routerAdmin;
