import { Product } from "../libs/types/product";
import Errors, { HttpCode, Message } from "../libs/Errors";
import { Basket, BasketInput, UpdateBasketInput } from "../libs/types/basket";
import BasketModel from "../schema/Basket.model";
import MemberService from "./Member.service";
import ProductService from "./Product.service";
import { Direction } from "../libs/enums/product.enum";

class BasketService {
  private readonly basketModel;
  private readonly productService;
  private readonly memberService;
  constructor() {
    this.basketModel = BasketModel;
    this.productService = new ProductService();
    this.memberService = new MemberService();
  }

  public async createCard(input: BasketInput): Promise<Basket> {
    try {
      const product = await this.productService.getProduct(
        null,
        input.productId
      );
      if (!product)
        throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);

      const member = await this.memberService.memberDetail(input.memberId);
      if (!member)
        throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);

      input.productPrice = product.productPrice;
      input.basketTotal = input.productPrice * input.basketQuantity;

      const card = await this.checkCard(input);
      if (!card) return await this.basketModel.create(input);

      return card;
    } catch (err) {
      console.log("Error, createCard:", err);
      throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
    }
  }

  private async checkCard(input: BasketInput): Promise<Basket | null> {
    const card = await this.basketModel
      .findOne({ productId: input.productId, memberId: input.memberId })
      .exec();

    if (card) {
      input.basketTotal = card.basketTotal + input.basketTotal;
      input.basketQuantity = card.basketQuantity + input.basketQuantity;
      return await this.basketModel
        .findOneAndUpdate(
          { productId: input.productId, memberId: input.memberId },
          input,
          { new: true }
        )
        .exec();
    } else {
      return null;
    }
  }

  public async updateCard(input: UpdateBasketInput): Promise<Basket> {
    const { _id, memberId, count } = input;
    const card: Basket = await this.basketModel
      .findOne({ _id: _id, memberId: memberId })
      .exec();

    if (card.basketQuantity === count) {
      return await this.basketModel
        .findOneAndRemove({ _id: _id, memberId: memberId })
        .exec();
    } else {
      const product: Product = await this.productService.getProduct(
        null,
        card.productId
      );

      const total = card.basketTotal - count * product.productPrice;
      const quantity = card.basketQuantity - count;
      return await this.basketModel
        .findOneAndUpdate(
          { _id: _id, memberId: memberId },
          { basketTotal: total, basketQuantity: quantity },
          { new: true }
        )
        .exec();
    }
  }

  public async allCard(memberId: Object): Promise<Basket[]> {
    const card = await this.basketModel
      .aggregate([
        { $match: { memberId: memberId } },
        { $sort: { updatedAt: Direction.DESC } },
        {
          $lookup: {
            from: "products",
            localField: "productId",
            foreignField: "_id",
            as: "productData",
          },
        },
        { $unwind: "$productData" },
      ])
      .exec();

    return card ? card : [];
  }

  public async removeBasket(memberId: Object): Promise<void> {
    await this.basketModel.deleteMany({ memberId: memberId }).exec();
  }
}

export default BasketService;
