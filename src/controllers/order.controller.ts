import { ExtendedRequest } from "../libs/types/member";
import { T } from "../libs/types/common";
import OrderService from "../models/Order.service";
import { Request, Response } from "express";
import { OrderInQuiry, OrderItemInput, UpdateOrder } from "../libs/types/order";
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

orderController.updateOrder = async (req: ExtendedRequest, res: Response) => {
  try {
    console.log("updateOrder");

    const input: UpdateOrder = req.body;

    const result = await orderService.updateOrder(req.member._id, input);
    res.json({ order: result });
  } catch (err) {
    console.log("Error, updateOrder:", err);
    res.send(err);
  }
};

/* ==================== ADMIN ==================== */

orderController.getOrders = async (req: Request, res: Response) => {
  try {
    console.log("getOrders");
    const result = await orderService.getOrders();
    res.json({ order: result });
  } catch (err) {
    console.log("Error, getOrders:", err);
    res.send(err);
  }
};

export default orderController;
