import express, { Request, Response } from "express";
import FindInvoiceUseCase from "../../../modules/invoice/usecase/find-invoice/find-invoice.usecase";
import { InvoiceRepository } from "../../../modules/invoice/repository/invoice.repository";
import { FindInvoiceUseCaseInputDTO } from "../../../modules/invoice/usecase/find-invoice/find-invoice.dto";


export const invoiceRoute = express.Router();

invoiceRoute.get("/:id", async (req: Request, res: Response) => {
  const usecase = new FindInvoiceUseCase(new InvoiceRepository());
  const params = req.params;

  try {
    const productDto: FindInvoiceUseCaseInputDTO = {
      id: params.id,
    };
    const output = await usecase.execute(productDto);
    res.send(output);
  } catch (err) {
    res.status(500).send(err);
  }
});
