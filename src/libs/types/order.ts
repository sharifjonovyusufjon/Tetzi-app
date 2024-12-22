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

  /* from aggregate */

  orderItemData?: [];
  productData?: [];
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

export interface OrderInQuiry {
  page: number;
  limit: number;
  orderStatus: OrderStatus;
}

export interface UpdateOrder {
  orderId: string;
  orderStatus: OrderStatus;
}
