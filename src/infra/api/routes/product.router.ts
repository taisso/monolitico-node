import express, { Request, Response } from "express";
import ProductRepository from "../../../modules/product-adm/repository/product.repository";
import AddProductUseCase from "../../../modules/product-adm/usecase/add-product/add-product.usecase";
import { AddProductInputDto } from "../../../modules/product-adm/usecase/add-product/add-product.dto";

export const productRoute = express.Router();

productRoute.post("/", async (req: Request, res: Response) => {
  const usecase = new AddProductUseCase(new ProductRepository());
  const body = req.body;

  try {
    const productDto: AddProductInputDto = {
      name: body.name,
      description: body.description,
      purchasePrice: body.purchasePrice,
      stock: body.stock,
    };
    const output = await usecase.execute(productDto);
    res.send(output);
  } catch (err) {
    res.status(500).send(err);
  }
});
