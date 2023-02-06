import InvoiceFacade from "../facade/invoice.facade";
import { IInvoiceFacade } from "../facade/invoice.facade.interface";
import { InvoiceRepository } from "../repository/invoice.repository";
import FindInvoiceUseCase from "../usecase/find-invoice/find-invoice.usecase";
import GenerateInvoiceUseCase from "../usecase/generate-invoice/generate-invoice.usecase";

export default class InvoiceFacadeFactory {
  static create(): IInvoiceFacade {
    const productRepository = new InvoiceRepository();
    const findUseCase = new FindInvoiceUseCase(productRepository);
    const generateCase = new GenerateInvoiceUseCase(productRepository);

    const facade = new InvoiceFacade({
      findUseCase: findUseCase,
      generateUseCase: generateCase,
    });

    return facade;
  }
}
