import { T } from "../libs/types/common";
import { OrderStatus } from "../libs/enums/order.enum";
import Errors, { HttpCode, Message } from "../libs/Errors";
import {
  Order,
  OrderInQuiry,
  OrderItem,
  OrderItemInput,
  UpdateOrder,
} from "../libs/types/order";
import OrderModel from "../schema/Order.model";
import OrderItemModel from "../schema/OrderItem.model";
import { ObjectId } from "mongoose";
import { shapeIntoMongooseObjectId } from "../libs/config";
import ProductService from "./Product.service";
import BasketService from "./Basket.service";
import { Basket } from "../libs/types/basket";

class OrderService {
  private readonly orderModel;
  private readonly orderItemModel;
  private readonly productService;
  private readonly basketService;
  constructor() {
    this.orderModel = OrderModel;
    this.orderItemModel = OrderItemModel;
    this.productService = new ProductService();
    this.basketService = new BasketService();
  }

  public async createOrder(memberId: ObjectId): Promise<Order> {
    const basket = await this.basketService.allCard(memberId);
    if (!basket.length)
      throw new Errors(HttpCode.BAD_REQUEST, Message.NO_DATA_FOUND);

    let input: OrderItemInput[] = [];
    await Promise.all(
      basket.map(async (ele: Basket) => {
        return await input.push({
          productId: ele.productId,
          itemQuantity: ele.basketQuantity,
          itemPrice: ele.productPrice,
        });
      })
    );

    const amount = input.reduce((accumulater: number, item: OrderItemInput) => {
      return accumulater + item.itemPrice * item.itemQuantity;
    }, 0);

    const delivery = amount < 100 ? 5 : 0;

    try {
      const result: Order = await this.orderModel.create({
        orderTotal: amount + delivery,
        orderDelivery: delivery,
        memberId: memberId,
      });

      await this.orderItem(result._id, input);
      await this.basketService.removeBasket(memberId);
      return result;
    } catch (err) {
      throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
    }
  }

  private async orderItem(
    orderId: ObjectId,
    input: OrderItemInput[]
  ): Promise<void> {
    const promiseAll = await input.map(async (ele) => {
      ele.orderId = orderId;

      try {
        await this.orderItemModel.create(ele);
      } catch (err) {
        throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
      }

      Promise.all(promiseAll);
    });
  }

  public async getMyOrders(
    memberId: ObjectId,
    input: OrderInQuiry
  ): Promise<Order> {
    const { page, limit, orderStatus } = input;

    const match: T = { memberId: memberId };
    const sort: T = { updatedAt: -1 };

    const result = await this.orderModel
      .aggregate([
        { $match: match },
        { $sort: sort },
        { $skip: (input.page - 1) * input.limit },
        { $limit: input.limit },
        {
          $lookup: {
            from: "orderItems",
            localField: "_id",
            foreignField: "orderId",
            as: "orderItemData",
          },
        },
        {
          $lookup: {
            from: "products",
            localField: "orderItemData.productId",
            foreignField: "_id",
            as: "productData",
          },
        },
      ])
      .exec();

    if (!result.length)
      throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
    return result[0];
  }

  public async updateOrder(
    memberId: ObjectId,
    input: UpdateOrder
  ): Promise<Order> {
    const { orderId, orderStatus } = input;

    const _id = shapeIntoMongooseObjectId(orderId);
    const result: Order = await this.orderModel
      .findOneAndUpdate(
        { _id: _id, memberId: memberId },
        { orderStatus: orderStatus },
        { new: true }
      )
      .exec();
    if (!result)
      throw new Errors(HttpCode.INTERNAL_SERVER_ERROR, Message.UPDATE_FAILED);

    if (result.orderStatus === OrderStatus.FINISH) {
      const itemTarget = await this.orderItemModel
        .find({ orderId: result._id })
        .exec();
      await this.rankProduct(itemTarget);
    }
    return result;
  }

  private async rankProduct(itemTarget: OrderItem[]): Promise<void> {
    const promiseAll = await itemTarget.map(async (ele) => {
      await this.productService.productStatisEditor({
        _id: ele.productId,
        targetKey: "productRank",
        modifier: 1,
      });
    });

    Promise.all(promiseAll);
  }

  /* ================ ADMIN =========================== */

  public async getOrders(): Promise<Order[]> {
    const result = await this.orderModel.find().exec();
    return result.length ? result : [];
  }
}

export default OrderService;
