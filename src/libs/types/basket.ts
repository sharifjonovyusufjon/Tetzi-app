import { ObjectId } from "mongoose";
import { Product } from "./product";

export interface BasketInput {
  basketTotal?: number;
  basketQuantity: number;
  productPrice?: number;
  memberId: ObjectId;
  productId: ObjectId;
}

export interface Basket {
  _id: ObjectId;
  basketTotal: number;
  basketQuantity: number;
  productPrice: number;
  memberId: ObjectId;
  productId: ObjectId;
  productData: Product;
}

export interface UpdateBasketInput {
  _id: ObjectId;
  count: number;
  memberId: ObjectId;
}
