import express, { Request, Response } from "express";
import AddClientUseCase from "../../../modules/client-adm/usecase/add-client/add-client.usecase";
import ClientRepository from "../../../modules/client-adm/repository/client.repository";
import { AddClientInputDto } from "../../../modules/client-adm/usecase/add-client/add-client.usecase.dto";


export const clientRoute = express.Router();

clientRoute.post("/", async (req: Request, res: Response) => {
  const usecase = new AddClientUseCase(new ClientRepository());
  const body = req.body;

  try {
    const clientDto: AddClientInputDto = {
      name: body.name,
      email: body.email,
      state: body.state,
      city: body.city,
      complement: body.complement,
      document: body.document,
      number: body.number,
      street: body.street,
      zipCode: body.zipCode,
    };
    const output = await usecase.execute(clientDto);
    res.send(output);
  } catch (err) {
    res.status(500).send(err);
  }
});
