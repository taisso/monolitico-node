import { Sequelize } from "sequelize-typescript";
import Id from "../../@shared/domain/value-object/id.value-object";
import Client from "../domain/client.entity";
import ClientModel from "./client.model";
import ClientRepository from "./client.repository";
import { Address } from "../../@shared/domain/value-object/address.value-object";

describe("ClientRepository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([ClientModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a client", async () => {
    const client = new Client({
      id: new Id("1"),
      name: "Client 1",
      email: "x@x.com",
      document: "123456789",
      address: new Address({
        street: "Address 1",
        number: "1",
        complement: "Complement 1",
        city: "City 1",
        state: "State 1",
        zipCode: "ZipCode 1",
      }),
    });

    const repository = new ClientRepository();
    await repository.add(client);

    const clientDb = await ClientModel.findOne({
      where: { id: client.id.id },
    });

    expect(clientDb).toBeDefined();
    expect(clientDb.id).toBe(client.id.id);
    expect(clientDb.name).toBe(client.name);
    expect(clientDb.email).toBe(client.email);
    expect(clientDb.document).toBe(client.document);
    expect(clientDb.street).toBe(client.address.value.street);
    expect(clientDb.number).toBe(client.address.value.number);
    expect(clientDb.complement).toBe(client.address.value.complement);
    expect(clientDb.city).toBe(client.address.value.city);
    expect(clientDb.state).toBe(client.address.value.state);
    expect(clientDb.zipCode).toBe(client.address.value.zipCode);
  });

  it("should find a client", async () => {
    const client = new Client({
      id: new Id("1"),
      name: "Client 1",
      email: "x@x.com",
      document: "123456789",
      address: new Address({
        street: "Address 1",
        number: "1",
        complement: "Complement 1",
        city: "City 1",
        state: "State 1",
        zipCode: "ZipCode 1",
      }),
    });

    const repository = new ClientRepository();
    await repository.add(client);

    const result = await repository.find("1");

    expect(result).toBeDefined();
    expect(result.id.id).toBe(client.id.id);
    expect(result.name).toBe(client.name);
    expect(result.email).toBe(client.email);
    expect(result.document).toBe(client.document);
    expect(result.address.value.street).toBe(client.address.value.street);
    expect(result.address.value.number).toBe(client.address.value.number);
    expect(result.address.value.complement).toBe(client.address.value.complement);
    expect(result.address.value.city).toBe(client.address.value.city);
    expect(result.address.value.state).toBe(client.address.value.state);
    expect(result.address.value.zipCode).toBe(client.address.value.zipCode);
  });
});
