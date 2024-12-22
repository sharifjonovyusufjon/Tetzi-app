import { ExtendedRequest } from "../libs/types/member";
import { T } from "../libs/types/common";
import OrderService from "../models/Order.service";
import { Request, Response } from "express";
import { OrderInQuiry, OrderItemInput } from "../libs/types/order";
import { OrderStatus } from "../libs/enums/order.enum";

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

orderController.getMyOrders = async (req: ExtendedRequest, res: Response) => {
  try {
    console.log("getMyOrders");

    const { page, limit, orderStatus } = req.query;

    const input: OrderInQuiry = {
      page: Number(page),
      limit: Number(limit),
      orderStatus: orderStatus as OrderStatus,
    };

    const result = await orderService.getMyOrders(req.member._id, input);
    res.json({ order: result });
  } catch (err) {
    console.log("Error, getMyOrders:", err);
    res.send(err);
  }
};

export default orderController;
