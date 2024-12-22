import { OrderStatus } from "../libs/enums/order.enum";
import Errors, { HttpCode, Message } from "../libs/Errors";
import { Order, OrderItemInput } from "../libs/types/order";
import OrderModel from "../schema/Order.model";
import OrderItemModel from "../schema/OrderItem.model";
import { ObjectId } from "mongoose";

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
}

export default OrderService;
