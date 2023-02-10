import request from "supertest";
import { faker } from '@faker-js/faker'
import { app, sequelize } from "../express";

describe("E2E test for client", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("should create a client", async () => {
    const clientFaker = {
        name: faker.name.firstName(),
        email: faker.internet.email(),
        state: faker.address.state(),
        city: faker.address.city(),
        street: faker.address.street(),
        zipCode: faker.address.zipCode(),
        complement: 'any_complement',
        document: 'any_document',
        number: 'any_number',
    }

    const response = await request(app)
      .post("/clients")
      .send(clientFaker);

    expect(response.status).toBe(200);
    expect(response.body.name).toBe(clientFaker.name);
    expect(response.body.street).toBe(clientFaker.street);
    expect(response.body.city).toBe(clientFaker.city);
    expect(response.body.number).toBe(clientFaker.number);
    expect(response.body.zipCode).toBe(clientFaker.zipCode);
  });
});
