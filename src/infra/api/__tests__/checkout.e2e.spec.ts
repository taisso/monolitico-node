import request from "supertest";
import { faker } from "@faker-js/faker";
import { app, sequelize } from "../express";
import ClientModel from "../../../modules/client-adm/repository/client.model";
import ProductModel from "../../../modules/store-catalog/repository/product.model";
import ProductAdmModel from "../../../modules/product-adm/repository/product.model";

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

   try {
    await ProductAdmModel.create({
        id: product1.id,
        name: product1.name,
        description: product1.description,
        stock: 10,
        purchasePrice: product1.salesPrice,
        createdAt: new Date(),
        updatedAt: new Date(),
    })
   }
   catch(err) {
    console.log(err);
   }

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
    expect(response.body.clientId).toBe(client.id);
    expect(response.body.total).toBe(product1.salesPrice + product2.salesPrice);
    expect(response.body.products).toStrictEqual(products);
  });
});
