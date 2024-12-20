import { T } from "../libs/types/common";
import { Direction, ProductStatus } from "../libs/enums/product.enum";
import Errors, { HttpCode, Message } from "../libs/Errors";
import {
  Product,
  ProductInput,
  ProductInQuery,
  UpdateProductInput,
} from "../libs/types/product";
import ProductModel from "../schema/Product.model";
import { ObjectId } from "mongoose";

class ProductService {
  private readonly productModel;
  constructor() {
    this.productModel = ProductModel;
  }

  public async getProduct(
    memberId: ObjectId,
    productId: ObjectId
  ): Promise<Product> {
    const productTarget = await this.productModel.findOne({
      _id: productId,
      productStatus: ProductStatus.PROCESS,
    });

    if (!productTarget)
      throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

    if (memberId) {
      // view integration
    }

    return productTarget;
  }

  public async getProducts(
    memberId: ObjectId,
    input: ProductInQuery
  ): Promise<Product[]> {
    const match: T = { productStatus: ProductStatus.PROCESS };
    const sort: T = {
      [input?.sort ?? "createdAt"]: input?.direction ?? Direction.DESC,
    };

    this.matchQuery(match, input);
    console.log("match", match);
    console.log("sort", sort);
    const result = await this.productModel
      .aggregate([
        { $match: match },
        { $sort: sort },
        { $skip: (input.page - 1) * input.limit },
        { $limit: input.limit },
      ])
      .exec();

    return result.length ? result : [];
  }

  private matchQuery(match: T, input: ProductInQuery): void {
    const { productBrand, productCategory, productColor, productPrice, text } =
      input.search;

    if (productCategory) match.productCategory = productCategory;
    if (productColor) match.productColor = productColor;
    if (productBrand) match.productBrand = productBrand;
    if (productPrice)
      match.productPrice = { $gte: productPrice.start, $lte: productPrice.end };
    if (text) match.productName = { $regex: new RegExp(text, "i") };
  }

  /* ------- ADMIN ------ */

  public async createProduct(input: ProductInput): Promise<Product> {
    try {
      const result: Product = await this.productModel.create(input);
      if (!result)
        throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);

      return result;
    } catch (err) {
      console.log("Error, createProduct:", err);
      throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
    }
  }

  public async updateProduct(input: UpdateProductInput): Promise<Product> {
    const result = await this.productModel
      .findByIdAndUpdate(input._id, input, { new: true })
      .exec();
    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

    return result;
  }

  public async getAllProduct(): Promise<Product[]> {
    const result = await this.productModel.find().exec();
    return result.length ? result : [];
  }
}
export default ProductService;
