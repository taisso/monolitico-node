import { Address } from "../../../@shared/domain/value-object/address.value-object";
import Id from "../../../@shared/domain/value-object/id.value-object";
import { Invoice } from "../../domain/invoice";
import { Product } from "../../domain/product";
import FindInvoiceUseCase from "./find-invoice.usecase";

const product = new Product({
    id: new Id(),
    name: 'product 1',
    price: 100,
})

const invoice = new Invoice({
  id: new Id("1"),
  name: 'fatura 1',
  document: 'documento 1',
  address: new Address({
    city: 'cidade 1',
    complement: 'complemento 1',
    number: '000',
    state: 'Estado 1',
    street: 'Rua 1',
    zipCode: '123'
  }),
  items: [product]
});

const MockRepository = () => {
  return {
    create: jest.fn(),
    find: jest.fn().mockReturnValue(Promise.resolve(invoice)),
  };
};

describe("find a invoice usecase unit test", () => {
  it("should find a invoice", async () => {
    const invoiceRepository = MockRepository();
    const usecase = new FindInvoiceUseCase(invoiceRepository);

    const input = {
      id: "1",
    };

    const result = await usecase.execute(input);

    expect(invoiceRepository.find).toHaveBeenCalled();
    expect(result.id).toBe("1");
    expect(result.name).toBe("fatura 1");
    expect(result.document).toBe("documento 1");
    expect(result.total).toBe(100);
  });

  it("should not find a invoice", async () => {
    const invoiceRepository = MockRepository();
    const usecase = new FindInvoiceUseCase(invoiceRepository);
    jest.spyOn(invoiceRepository, 'find').mockResolvedValueOnce(null)

    const input = {
      id: "1",
    };

    const result = await usecase.execute(input);

    expect(result).toBeNull()
  });
});
