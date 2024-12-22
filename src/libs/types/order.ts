import { ObjectId } from "mongoose";
import { OrderStatus } from "../enums/order.enum";

export interface OrderInput {
  orderStatus: OrderStatus;
  orderTotal: number;
  orderDelivery: number;
  memberId: ObjectId;
}

export interface Order {
  _id: ObjectId;
  orderStatus: OrderStatus;
  orderTotal: number;
  orderDelivery: number;
  memberId: ObjectId;
}

export interface OrderItemInput {
  itemQuantity: number;
  itemPrice: number;
  orderId: ObjectId;
  productId: ObjectId;
}

export interface OrderItem {
  itemQuantity: number;
  itemPrice: number;
  orderId: ObjectId;
  productId: ObjectId;
}
