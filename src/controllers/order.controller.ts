import { ExtendedRequest } from "../libs/types/member";
import { T } from "../libs/types/common";
import OrderService from "../models/Order.service";
import { Request, Response } from "express";
import { OrderInQuiry, OrderItemInput, UpdateOrder } from "../libs/types/order";
import { OrderStatus } from "../libs/enums/order.enum";
import Errors, { Message } from "../libs/Errors";

const orderController: T = {};
const orderService = new OrderService();

orderController.createOrder = async (req: ExtendedRequest, res: Response) => {
  try {
    console.log("createOrder");

    const result = await orderService.createOrder(req.member._id);
    res.json({ order: result });
  } catch (err) {
    console.log("Error, createOrder:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standart.code).json(Errors.standart);
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
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standart.code).json(Errors.standart);
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
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standart.code).json(Errors.standart);
  }
};

/* ==================== ADMIN ==================== */

orderController.getOrders = async (req: Request, res: Response) => {
  try {
    console.log("getOrders");
    const result = await orderService.getOrders();
    res.render("orders", { orders: result });
  } catch (err) {
    console.log("Error, getOrders:", err);
    const message =
      err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG;
    res.send(`<script> alert("${message}")</script>`);
  }
};

export default orderController;
