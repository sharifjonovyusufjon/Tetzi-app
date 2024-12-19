import Errors, { HttpCode, Message } from "../libs/Errors";
import { Product, ProductInput } from "../libs/types/product";
import ProductModel from "../schema/Product.model";

class ProductService {
  private readonly productModel;
  constructor() {
    this.productModel = ProductModel;
  }

  /* ------- ADMIN ------ */

  public async createProduct(input: ProductInput): Promise<Product> {
    try {
      const result = await this.productModel.create(input);
      if (!result)
        throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);

      return result;
    } catch (err) {
      console.log("Error, createProduct:", err);
      throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
    }
  }
}
export default ProductService;
