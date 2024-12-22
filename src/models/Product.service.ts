import { T } from "../libs/types/common";
import { Direction, ProductStatus } from "../libs/enums/product.enum";
import Errors, { HttpCode, Message } from "../libs/Errors";
import {
  Product,
  ProductBestSellerInQuery,
  ProductInput,
  ProductInQuery,
  UpdateProductInput,
} from "../libs/types/product";
import ProductModel from "../schema/Product.model";
import { ObjectId } from "mongoose";
import ViewService from "./View.service";
import { ViewInput } from "../libs/types/view";
import { ViewGroup } from "../libs/enums/view.num";
import { StatatisEditor } from "../libs/config";

class ProductService {
  private readonly productModel;
  private readonly viewService;
  constructor() {
    this.productModel = ProductModel;
    this.viewService = new ViewService();
  }

  public async getProduct(
    memberId: ObjectId | null,
    productId: ObjectId
  ): Promise<Product> {
    const match: T = { _id: productId, productStatus: ProductStatus.PROCESS };
    const productTarget = await this.productModel
      .aggregate([
        { $match: match },
        {
          $lookup: {
            from: "comments",
            localField: "_id",
            foreignField: "commentRefId",
            as: "productData",
          },
        },
      ])
      .exec();

    if (!productTarget.length)
      throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

    if (memberId) {
      const viewInput: ViewInput = {
        viewGroup: ViewGroup.PRODUCT,
        memberId: memberId,
        viewRefId: productId,
      };
      const newView = await this.viewService.checkView(viewInput);
      if (newView) {
        this.productStatisEditor({
          _id: productId,
          targetKey: "productViews",
          modifier: 1,
        });

        productTarget[0].productViews++;
      }
    }

    return productTarget[0];
  }

  public async productStatisEditor(input: StatatisEditor): Promise<void> {
    const { _id, targetKey, modifier } = input;
    return await this.productModel
      .findByIdAndUpdate(
        _id,
        { $inc: { [targetKey]: modifier } },
        { new: true }
      )
      .exec();
  }

  public async getProducts(
    memberId: ObjectId | null,
    input: ProductInQuery
  ): Promise<Product[]> {
    const match: T = { productStatus: ProductStatus.PROCESS };
    const sort: T = {
      [input?.sort ?? "createdAt"]: input?.direction ?? Direction.DESC,
    };

    this.matchQuery(match, input);

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

  public async getBestSeller(
    memberId: ObjectId | null,
    input: ProductBestSellerInQuery
  ): Promise<Product[]> {
    const match: T = {
      productStatus: ProductStatus.PROCESS,
      productRank: { $gte: 1 },
    };
    const sort: T = { productRank: Direction.DESC };

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
