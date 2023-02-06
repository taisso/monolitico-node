import { Address } from "../../../@shared/domain/value-object/address.value-object";
import Id from "../../../@shared/domain/value-object/id.value-object";
import { Invoice } from "../../domain/invoice";
import { Product } from "../../domain/product";
import { GenerateInvoiceUseCaseInputDto } from "./generate-invoice.dto";
import GenerateInvoiceUseCase from "./generate-invoice.usecase";

const product = new Product({
    id: new Id('1'),
    name: 'foo',
    price: 100,
})

const invoice = new Invoice({
  id: new Id(),
  name: 'fatura foo',
  document: 'documento foo',
  address: new Address({
    number: '000',
    state: 'cidade foo',
    street: 'rua foo',
    zipCode: '00000-000',
    city: 'fulano foo',
    complement: 'complemento foo',
  }),
  items: [product]
});

const MockRepository = () => {
  return {
    create: jest.fn().mockResolvedValue(invoice),
    find: jest.fn(),
  };
};

describe("create a invoice usecase unit test", () => {
  it("should find a create", async () => {
    const invoiceRepository = MockRepository();
    const usecase = new GenerateInvoiceUseCase(invoiceRepository);

    const input: GenerateInvoiceUseCaseInputDto = {
      name: 'fatura foo',
      city: 'fulano foo',
      complement: 'complemento foo',
      document: 'documento foo',
      items: [{ id: '1', name: 'foo', price: 100  }],
      number: '000',
      state: 'cidade foo',
      street: 'rua foo',
      zipCode: '00000-000'
    };

    const result = await usecase.execute(input);

    expect(invoiceRepository.create).toHaveBeenCalled()
    expect(result.name).toBe(input.name);
    expect(result.document).toBe(input.document);
    expect(result.city).toBe(input.city)
    expect(result.state).toBe(input.state)
    expect(result.total).toBe(100);
  });

});
