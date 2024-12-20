import { AdminRequest, ExtendedRequest } from "../libs/types/member";
import { Request, Response } from "express";
import { T } from "../libs/types/common";
import Errors, { HttpCode, Message } from "../libs/Errors";
import {
  ProductInput,
  ProductInQuery,
  UpdateProductInput,
} from "../libs/types/product";
import ProductService from "../models/Product.service";
import { shapeIntoMongooseObjectId } from "../libs/config";

const productController: T = {};
const productService = new ProductService();

productController.getProduct = async (req: ExtendedRequest, res: Response) => {
  try {
    console.log("getProduct");
    const productId = shapeIntoMongooseObjectId(req.params.id);
    const result = await productService.getProduct(req.member._id, productId);
    res.json({ product: result });
  } catch (err) {
    console.log("Error, getProduct:", err);
    res.send(err);
  }
};

productController.getProducts = async (req: ExtendedRequest, res: Response) => {
  try {
    console.log("getProducts");
    const { page, sort, direction, limit, search } = req.query;
    const input: ProductInQuery = {
      page: Number(page),
      sort: String(sort),
      direction: Number(direction),
      limit: Number(limit),
      search: {},
    };

    const result = await productService.getProducts(req.member._id, input);
    res.json(result);
  } catch (err) {
    console.log("Error, getProducts:", err);
    res.send(err);
  }
};

/* ------- ADMIN ------ */

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

productController.updateProduct = async (req: Request, res: Response) => {
  try {
    console.log("updateProduct");
    const input: UpdateProductInput = req.body;
    input._id = shapeIntoMongooseObjectId(req.params.id);
    const result = await productService.updateProduct(input);
    res.json({ product: result });
  } catch (err) {
    console.log("Error, updateProduct:", err);
    res.send(err);
  }
};

productController.getAllProduct = async (req: Request, res: Response) => {
  try {
    console.log("getAllProduct");
    const result = await productService.getAllProduct();
    res.json({ product: result });
  } catch (err) {
    console.log("Error, getAllProduct:", err);
    res.send(err);
  }
};
export default productController;
