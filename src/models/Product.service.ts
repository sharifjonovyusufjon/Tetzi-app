import { ProductStatus } from "../libs/enums/product.enum";
import Errors, { HttpCode, Message } from "../libs/Errors";
import {
  Product,
  ProductInput,
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
    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

    return result;
  }
}
export default ProductService;
