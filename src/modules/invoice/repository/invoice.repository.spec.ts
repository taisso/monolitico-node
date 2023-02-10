import { Sequelize } from "sequelize-typescript";
import { randomUUID } from "node:crypto";
import InvoiceModel from "./models/invoice.model";
import ItemsModel from "./models/product.model";
import { InvoiceRepository } from "./invoice.repository";
import { SequelizeInvoiceMapper } from "./mappers/sequelize-invoice.mappers";
import { Invoice } from "../domain/invoice";
import Id from "../../@shared/domain/value-object/id.value-object";
import { Address } from "../../@shared/domain/value-object/address.value-object";
import { Product } from "../domain/product";

describe("InvoiceRepository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([InvoiceModel, ItemsModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should find a invoice", async () => {
    const id = randomUUID();

    const invoiceCreated = await InvoiceModel.create(
      {
        id,
        name: "fatura 1",
        document: "documento 1",
        street: "Rua fulano",
        number: "000",
        complement: "complemto 1",
        city: "cidade 1",
        state: "estado 1",
        zipCode: "00000-000",
        items: [
          {
            id: randomUUID(),
            name: "item 1",
            price: 100,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      { include: { model: ItemsModel } }
    );

    const invoice = new InvoiceRepository();
    const foundInvoice = await invoice.find(id);

    expect(foundInvoice).toEqual(
      SequelizeInvoiceMapper.toDomain(invoiceCreated)
    );
  });

  it("should create a invoice", async () => {
    const id = randomUUID();
    const input = new Invoice({
      id: new Id(id),
      document: "documento 1",
      name: "fatura 1",
      address: new Address({
        city: "cidade fulano",
        complement: "complmento fulano",
        number: "000",
        state: "estado fulano",
        street: "rua fulano",
        zipCode: "00000-000",
      }),
      items: [
        new Product({
          name: "prod 1",
          price: 100,
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const invoice = new InvoiceRepository();
    const invoiceDomain = await invoice.create(input);

    expect(invoiceDomain).toEqual(input);
  });
});
