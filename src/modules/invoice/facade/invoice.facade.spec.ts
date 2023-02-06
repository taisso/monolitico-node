import { Sequelize } from "sequelize-typescript";
import { randomUUID } from "node:crypto";
import InvoiceModel from "../repository/models/invoice.model";
import ProductModel from "../repository/models/product.model";
import InvoiceFacadeFactory from "../factory/facade.factory";
import { GenerateInvoiceUseCaseInputDto } from "../usecase/generate-invoice/generate-invoice.dto";

describe("InvoiceFacade test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([InvoiceModel, ProductModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should find a invoice", async () => {
    const facade = InvoiceFacadeFactory.create();
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
      { include: { model: ProductModel } }
    );

    const result = await facade.find({ id });

    expect(result.id).toBe(id);
    expect(result.name).toBe(invoiceCreated.name);
    expect(result.document).toBe(invoiceCreated.document);
    expect(result.total).toBe(100);
  });

  it("should create invoice", async () => {
    const facade = InvoiceFacadeFactory.create();
    const input: GenerateInvoiceUseCaseInputDto = {
      name: "fatura foo",
      city: "fulano foo",
      complement: "complemento foo",
      document: "documento foo",
      items: [{ id: "1", name: "foo", price: 100 }],
      number: "000",
      state: "cidade foo",
      street: "rua foo",
      zipCode: "00000-000",
    };

    const result = await facade.generate(input);

    expect(result.name).toBe(input.name)
    expect(result.document).toBe(input.document)
    expect(result.number).toBe(input.number)
    expect(result.state).toBe(input.state)
    expect(result.street).toBe(input.street)
    expect(result.zipCode).toBe(input.zipCode)
    expect(result.city).toBe(input.city)
    expect(result.complement).toBe(input.complement)
    expect(result.items).toEqual(input.items)
  });
});
