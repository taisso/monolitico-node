import { resolve } from 'path'
import request from "supertest";
import { faker } from "@faker-js/faker";
import { app } from "../express";
import { AddProductInputDto } from "../../../modules/product-adm/usecase/add-product/add-product.dto";
import ProductModel from "../../../modules/product-adm/repository/product.model";
import { migrator, sequelize } from '../../db/sequelize/config/umzug';

describe("E2E test for product", () => {
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

  it("should create a product", async () => {
    const productFaker: AddProductInputDto = {
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      purchasePrice: +faker.commerce.price(),
      stock: 10,
    };

    jest.spyOn(ProductModel, "create").mockImplementation(() => jest.fn());

    const response = await request(app).post("/products").send(productFaker);

    expect(response.status).toBe(200);
    expect(response.body.name).toBe(productFaker.name);
    expect(response.body.description).toBe(productFaker.description);
    expect(response.body.purchasePrice).toBe(productFaker.purchasePrice);
    expect(response.body.stock).toBe(productFaker.stock);
  });
});
