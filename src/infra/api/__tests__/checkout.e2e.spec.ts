import request from "supertest";
import { faker } from "@faker-js/faker";
import { app, sequelize } from "../express";
import ClientModel from "../../../modules/client-adm/repository/client.model";
import ProductModel from "../../../modules/store-catalog/repository/product.model";
import CheckStockUseCase from "../../../modules/product-adm/usecase/check-stock/check-stock.usecase";

const addressFaker = () => ({
  street: faker.address.street(),
  number: "any_number",
  complement: "any_complement",
  city: faker.address.city(),
  state: faker.address.state(),
  zipCode: faker.address.zipCode(),
});

const createClient = async () => {
  return ClientModel.create({
    id: faker.datatype.uuid(),
    name: faker.name.firstName(),
    email: faker.internet.email(),
    document: faker.random.alphaNumeric(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...addressFaker(),
  });
};

const createProductCatalog = async () => {
  return ProductModel.create({
    id: faker.datatype.uuid(),
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    salesPrice: +faker.commerce.price(),
    createdAt: new Date(),
    updatedAt: new Date(),
  });
};

describe("E2E test for checkout", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("should create a checkout", async () => {
    const client = await createClient();
    const product1 = await createProductCatalog();
    const product2 = await createProductCatalog();

    jest
      .spyOn(CheckStockUseCase.prototype, "execute")
      .mockImplementation(({ productId }: { productId: string }) =>
        Promise.resolve({
          productId,
          stock: 10,
        })
      );

    const products = [
      {
        productId: product1.id,
      },
      {
        productId: product2.id,
      },
    ];

    const response = await request(app).post("/checkout").send({
      clientId: client.id,
      products,
    });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("approved");
    expect(response.body.products).toEqual(products);
    expect(response.body.total).toBe(product1.salesPrice + product2.salesPrice);
  });
});
