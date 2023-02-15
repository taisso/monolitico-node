import { resolve } from 'path'
import request from "supertest";
import { faker } from "@faker-js/faker";
import { app } from "../express";
import ClientModel from "../../../modules/client-adm/repository/client.model";
import { migrator, sequelize } from "../../db/sequelize/config/umzug";
import { QueryTypes } from 'sequelize';

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
  const price = +faker.commerce.price()
 
  const product = {
    id: faker.datatype.uuid(),
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    purchasePrice: price,
    stock: 10,
    salesPrice: price,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  await sequelize.query(`
    INSERT INTO
      products (
        id,
        name,
        description,
        "purchasePrice",
        "salesPrice",
        stock,
        "createdAt",
        "updatedAt"
      )
    VALUES
      ('${product.id}', 
       '${product.name}', 
       '${product.description}', 
        ${product.purchasePrice}, 
        ${product.salesPrice}, 
        ${product.stock},
        date('now'), 
        date('now')
      )
  `, { type: QueryTypes.INSERT })

  return product
};

describe("E2E test for checkout", () => {

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

  it("should create a checkout", async () => {
    const client = await createClient();
    const product1 = await createProductCatalog();
    const product2 = await createProductCatalog();
  
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
