import { AdminRequest, ExtendedRequest } from "../libs/types/member";
import { Request, Response } from "express";
import { T } from "../libs/types/common";
import Errors, { HttpCode, Message } from "../libs/Errors";
import {
  ProductBestSellerInQuery,
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
    let memberId;
    if (req.member === undefined) {
      memberId = null;
    } else {
      memberId = shapeIntoMongooseObjectId(req.member._id);
    }

    console.log("memberid:", memberId);
    const productId = shapeIntoMongooseObjectId(req.params.id);
    const result = await productService.getProduct(memberId, productId);
    res.json({ product: result });
  } catch (err) {
    console.log("Error, getProduct:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standart.code).json(Errors.standart);
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

    let memberId;
    if (req.member === undefined) {
      memberId = null;
    } else {
      memberId = shapeIntoMongooseObjectId(req.member._id);
    }
    const result = await productService.getProducts(memberId, input);
    res.json(result);
  } catch (err) {
    console.log("Error, getProducts:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standart.code).json(Errors.standart);
  }
};

productController.getBestSeller = async (
  req: ExtendedRequest,
  res: Response
) => {
  try {
    console.log("getBestSeller");
    const { page, limit } = req.query;
    const input: ProductBestSellerInQuery = {
      page: Number(page),
      limit: Number(limit),
    };

    let memberId;
    if (req.member === undefined) {
      memberId = null;
    } else {
      memberId = shapeIntoMongooseObjectId(req.member._id);
    }

    const result = await productService.getBestSeller(memberId, input);
    res.json(result);
  } catch (err) {
    console.log("Error, getBestSeller:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standart.code).json(Errors.standart);
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
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standart.code).json(Errors.standart);
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
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standart.code).json(Errors.standart);
  }
};

productController.getAllProduct = async (req: Request, res: Response) => {
  try {
    console.log("getAllProduct");
    const result = await productService.getAllProduct();
    res.json({ product: result });
  } catch (err) {
    console.log("Error, getAllProduct:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standart.code).json(Errors.standart);
  }
};
export default productController;
