import ClientGateway from "../gateway/client.gateway";
import ClientModel from "./client.model";
import Id from "../../@shared/domain/value-object/id.value-object";
import Client from "../domain/client.entity";
import { Address } from "../../@shared/domain/value-object/address.value-object";

export default class ClientRepository implements ClientGateway {
  async find(id: string): Promise<Client> {
    const client = await ClientModel.findOne({ where: { id } });

    if (!client) {
      throw new Error("Client not found");
    }

    return new Client({
      id: new Id(client.id),
      name: client.name,
      email: client.email,
      document: client.document,
      address: new Address({
        street: client.street,
        number: client.number,
        complement: client.complement,
        city: client.city,
        state: client.state,
        zipCode: client.zipCode,
      }),
    });
  }

  async add(client: Client): Promise<void> {
    await ClientModel.create({
      id: client.id.id,
      name: client.name,
      email: client.email,
      document: client.document,
      street: client.address.value.street,
      number: client.address.value.number,
      complement: client.address.value.complement,
      city: client.address.value.city,
      state: client.address.value.state,
      zipCode: client.address.value.zipCode,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}
