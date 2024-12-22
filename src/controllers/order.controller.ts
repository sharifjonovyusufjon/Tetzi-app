import { ExtendedRequest } from "../libs/types/member";
import { T } from "../libs/types/common";
import OrderService from "../models/Order.service";
import { Request, Response } from "express";
import { OrderItemInput } from "../libs/types/order";

const orderController: T = {};
const orderService = new OrderService();

orderController.createOrder = async (req: ExtendedRequest, res: Response) => {
  try {
    console.log("createOrder");

    const input: OrderItemInput[] = req.body;

    const result = await orderService.createOrder(req.member._id, input);
    res.json({ order: result });
  } catch (err) {
    console.log("Error, createOrder:", err);
    res.send(err);
  }
};

export default orderController;
