import { resolve } from 'path'
import request from "supertest";
import { faker } from '@faker-js/faker'
import { app } from "../express";
import { migrator, sequelize } from '../../db/sequelize/config/umzug';

describe("E2E test for client", () => {
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
