import { Address } from "../../../@shared/domain/value-object/address.value-object";
import Id from "../../../@shared/domain/value-object/id.value-object";
import { Invoice } from "../../domain/invoice";
import { Product } from "../../domain/product";
import InvoiceModel from "../models/invoice.model";

export class SequelizeInvoiceMapper {
  static toDomain(data: InvoiceModel): Invoice {
    if(!data) return null

    return new Invoice({
      id: new Id(data.id),
      name: data.name,
      document: data.document,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      address: new Address({
        city: data.city,
        complement: data.complement,
        number: data.number,
        state: data.state,
        street: data.street,
        zipCode: data.zipCode,
      }),
      items: data?.items?.map((item) => {
        return new Product({
          id: new Id(item.id),
          name: item.name,
          price: item.price,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt
        });
      }),
    });
  }

  static toSequelize(data: Invoice) {
    return {
      id: data.id.id,
      name: data.name,
      document: data.document,
      city: data.address.value.city,
      street: data.address.value.street,
      state: data.address.value.state,
      zipCode: data.address.value.zipCode,
      number: data.address.value.number,
      complement: data.address.value.complement,
      items: data?.items?.map((item) => ({
        id: item.id.id,
        name: item.name,
        price: item.price,
        invoiceId: data.id.id,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt
      })),
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    }
  }
}
