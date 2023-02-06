import { InvoiceGateway } from "../../gateway/invoice.gateway";
import {
  FindInvoiceUseCaseInputDTO,
  FindInvoiceUseCaseOutputDTO,
} from "./find-invoice.dto";

export default class FindInvoiceUseCase {
  constructor(private readonly invoiceRepository: InvoiceGateway) {}

  async execute(
    input: FindInvoiceUseCaseInputDTO
  ): Promise<FindInvoiceUseCaseOutputDTO> {
    const invoice = await this.invoiceRepository.find(input.id);

    if(!invoice) return null;

    return {
      id: invoice.id.id,
      name: invoice.name,
      document: invoice.document,
      createdAt: invoice.createdAt,
      address: {
        city: invoice.address.value.city,
        complement: invoice.address.value.complement,
        number: invoice.address.value.number,
        state: invoice.address.value.state,
        street: invoice.address.value.street,
        zipCode: invoice.address.value.zipCode,
      },
      items: invoice.items.map((item) => ({
        id: item.id.id,
        name: item.name,
        price: item.price,
      })),
      total: invoice.total(),
    };
  }
}
