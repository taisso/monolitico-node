import { Invoice } from "../../domain/invoice";
import { InvoiceGateway } from "../../gateway/invoice.gateway";
import {
  GenerateInvoiceUseCaseInputDto,
  GenerateInvoiceUseCaseOutputDto,
} from "./generate-invoice.dto";
import { GenerateInvoiceMapper } from "./mappers/generate-invoice.mapper";

export default class GenerateInvoiceUseCase {
  constructor(private readonly invoiceRepository: InvoiceGateway) {}

  async execute(
    input: GenerateInvoiceUseCaseInputDto
  ): Promise<GenerateInvoiceUseCaseOutputDto> {
    const invoice = (await this.invoiceRepository.create(
      GenerateInvoiceMapper.toInput(input)
    )) as Invoice;

    return GenerateInvoiceMapper.toOutPut(invoice);
  }
}
