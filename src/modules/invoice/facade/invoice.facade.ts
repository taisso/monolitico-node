import FindInvoiceUseCase from "../usecase/find-invoice/find-invoice.usecase";
import GenerateInvoiceUseCase from "../usecase/generate-invoice/generate-invoice.usecase";
import {
  FindInvoiceFacadeInputDTO,
  FindInvoiceFacadeOutputDTO,
  GenerateInvoiceFacadeInputDto,
  GenerateInvoiceFacadeOutputDto,
  IInvoiceFacade,
} from "./invoice.facade.interface";

export interface UseCaseProps {
  findUseCase: FindInvoiceUseCase;
  generateUseCase: GenerateInvoiceUseCase;
}

export default class InvoiceFacade implements IInvoiceFacade {
  private _findUseCase: FindInvoiceUseCase;
  private _generateUseCase: GenerateInvoiceUseCase;

  constructor(props: UseCaseProps) {
    this._findUseCase = props.findUseCase;
    this._generateUseCase = props.generateUseCase;
  }

  async find(
    input: FindInvoiceFacadeInputDTO
  ): Promise<FindInvoiceFacadeOutputDTO> {
    return await this._findUseCase.execute(input);
  }

  async generate(
    input: GenerateInvoiceFacadeInputDto
  ): Promise<GenerateInvoiceFacadeOutputDto> {
    return await this._generateUseCase.execute(input);
  }
}
