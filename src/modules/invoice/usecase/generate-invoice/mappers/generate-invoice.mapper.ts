import { Address } from "../../../../@shared/domain/value-object/address.value-object";
import Id from "../../../../@shared/domain/value-object/id.value-object";
import { Invoice } from "../../../domain/invoice";
import { Product } from "../../../domain/product";
import {
  GenerateInvoiceUseCaseInputDto,
  GenerateInvoiceUseCaseOutputDto,
} from "../generate-invoice.dto";

export class GenerateInvoiceMapper {
  static toInput(input: GenerateInvoiceUseCaseInputDto) {
    return new Invoice({
      id: new Id(),
      name: input.name,
      document: input.document,
      address: new Address({
        city: input.city,
        complement: input.complement,
        number: input.number,
        state: input.state,
        street: input.street,
        zipCode: input.zipCode,
      }),
      items: input?.items?.map((item) => {
        return new Product({
          id: new Id(item.id),
          name: item.name,
          price: item.price,
        });
      }),
    });
  }

  static toOutPut(input: Invoice): GenerateInvoiceUseCaseOutputDto {
    return {
      id: input.id.id,
      name: input.name,
      document: input.document,
      city: input.address.value.city,
      complement: input.address.value.complement,
      number: input.address.value.number,
      state: input.address.value.state,
      street: input.address.value.street,
      zipCode: input.address.value.zipCode,
      items: input.items.map((item) => ({
        id: item.id.id,
        name: item.name,
        price: item.price,
      })),
      total: input.total(),
    };
  }
}
