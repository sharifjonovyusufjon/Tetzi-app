import { AdminRequest } from "../libs/types/member";
import { Response } from "express";
import { T } from "../libs/types/common";
import Errors, { HttpCode, Message } from "../libs/Errors";
import { ProductInput } from "../libs/types/product";
import ProductService from "../models/Product.service";

const productController: T = {};
const productService = new ProductService();

productController.createProduct = async (req: AdminRequest, res: Response) => {
  try {
    console.log("createProduct");
    if (!req.files.length)
      throw new Errors(HttpCode.INTERNAL_SERVER_ERROR, Message.CREATE_FAILED);

    const input: ProductInput = req.body;
    input.productImages = req.files.map((ele) => {
      return ele.path.replace(/\\/g, "/");
    });

    const result = await productService.createProduct(input);
    res.json({ product: result });
  } catch (err) {
    console.log("Error, createProduct:", err);
    res.send(err);
  }
};

export default productController;
