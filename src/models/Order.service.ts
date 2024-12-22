import { T } from "../libs/types/common";
import { OrderStatus } from "../libs/enums/order.enum";
import Errors, { HttpCode, Message } from "../libs/Errors";
import {
  Order,
  OrderInQuiry,
  OrderItemInput,
  UpdateOrder,
} from "../libs/types/order";
import OrderModel from "../schema/Order.model";
import OrderItemModel from "../schema/OrderItem.model";
import { ObjectId } from "mongoose";
import { shapeIntoMongooseObjectId } from "../libs/config";

class OrderService {
  private readonly orderModel;
  private readonly orderItemModel;
  constructor() {
    this.orderModel = OrderModel;
    this.orderItemModel = OrderItemModel;
  }

  public async createOrder(
    memberId: ObjectId,
    input: OrderItemInput[]
  ): Promise<Order> {
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
    const result = await this.orderModel
      .findOneAndUpdate(
        { _id: _id, memberId: memberId },
        { orderStatus: orderStatus },
        { new: true }
      )
      .exec();
    if (!result)
      throw new Errors(HttpCode.INTERNAL_SERVER_ERROR, Message.UPDATE_FAILED);
    return result;
  }

  /* ================ ADMIN =========================== */

  public async getOrders(): Promise<Order[]> {
    const result = await this.orderModel.find().exec();
    return result.length ? result : [];
  }
}

export default OrderService;
