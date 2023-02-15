import { resolve } from 'path'
import request from "supertest";
import { faker } from "@faker-js/faker";
import { app } from "../express";
import InvoiceModel from "../../../modules/invoice/repository/models/invoice.model";
import ItemsModel from "../../../modules/invoice/repository/models/product.model";
import { migrator, sequelize } from '../../db/sequelize/config/umzug';

describe("E2E test for invoice", () => {
  beforeAll(() => {
    sequelize.addModels([resolve() + '/**/*.model.ts'])
  })

  beforeEach(async () => {
    await migrator.up();
  });

  afterEach(async () => {
    await migrator.down();
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("should find a invoice", async () => {
    const invoiceFaker = {
      id: faker.datatype.uuid(),
      name: faker.random.alphaNumeric(),
      document: faker.random.alphaNumeric(),
      street: faker.address.street(),
      number: "any_number",
      complement: "any_complement",
      city: faker.address.city(),
      state: faker.address.state(),
      zipCode: faker.address.zipCode(),
      items: [
        {
          id: faker.datatype.uuid(),
          name: faker.commerce.productName(),
          price: +faker.commerce.price(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await InvoiceModel.create(invoiceFaker, {
      include: { model: ItemsModel },
    });

    const response = await request(app).get(`/invoice/${invoiceFaker.id}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(invoiceFaker.id);
    expect(response.body.name).toBe(invoiceFaker.name);
    expect(response.body.document).toBe(invoiceFaker.document);
    expect(response.body.address.street).toBe(invoiceFaker.street);
    expect(response.body.address.city).toBe(invoiceFaker.city);
    expect(response.body.address.number).toBe(invoiceFaker.number);
    expect(response.body.address.complement).toBe(invoiceFaker.complement);
    expect(response.body.address.state).toBe(invoiceFaker.state);
    expect(response.body.address.zipCode).toBe(invoiceFaker.zipCode);
    expect(response.body.items).toEqual(
      invoiceFaker.items.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
      }))
    );
    expect(response.body.total).toBeDefined();
  });
});
