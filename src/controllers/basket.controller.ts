import { T } from "../libs/types/common";
import Errors from "../libs/Errors";
import { ExtendedRequest } from "../libs/types/member";
import { Request, Response } from "express";
import { BasketInput, UpdateBasketInput } from "../libs/types/basket";
import { shapeIntoMongooseObjectId } from "../libs/config";
import BasketService from "../models/Basket.service";

const basketController: T = {};
const basketService = new BasketService();

basketController.createCard = async (req: ExtendedRequest, res: Response) => {
  try {
    console.log("createCard");
    const input: BasketInput = req.body;
    input.productId = shapeIntoMongooseObjectId(input.productId);
    input.memberId = req.member._id;
    const result = await basketService.createCard(input);
    res.json({ basket: result });
  } catch (err) {
    console.log("Error, createCard:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standart.code).json(Errors.standart);
  }
};

basketController.updateCard = async (req: ExtendedRequest, res: Response) => {
  try {
    const input: UpdateBasketInput = req.body;
    input.memberId = req.member._id;
    input._id = shapeIntoMongooseObjectId(input._id);

    const result = await basketService.updateCard(input);
    res.json({ basket: result });
  } catch (err) {
    console.log("Error, updateCard:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standart.code).json(Errors.standart);
  }
};

basketController.allCard = async (req: ExtendedRequest, res: Response) => {
  try {
    const result = await basketService.allCard(req.member._id);
    res.json({ basket: result });
  } catch (err) {
    console.log("Error, allCard:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standart.code).json(Errors.standart);
  }
};

export default basketController;
