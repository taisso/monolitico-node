import express, { Request, Response } from "express";
import PlaceOrderFacadeFactory from "../../../modules/checkout/factory/facade.factory";
import { IPlaceOrderInputDto } from "../../../modules/checkout/usecase/place-order/place-order.dto";

export const checkoutRoute = express.Router();

checkoutRoute.post("/", async (req: Request, res: Response) => {
  const mockCheckoutRepository = {
    addOrder: jest.fn(),
    findOrder: jest.fn(),
  };
  const factory = PlaceOrderFacadeFactory.createWithCustomRepo(
    mockCheckoutRepository
  );

  const body = req.body;

  try {
    const productDto: IPlaceOrderInputDto = {
      clientId: body.clientId,
      products: body.products
    };
    const output = await factory.create(productDto);
    res.send(output);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});
