import { Invoice } from "../domain/invoice";
import { InvoiceGateway } from "../gateway/invoice.gateway";
import { SequelizeInvoiceMapper } from "./mappers/sequelize-invoice.mappers";
import InvoiceModel from "./models/invoice.model";
import ProductModel from "./models/product.model";

export class InvoiceRepository implements InvoiceGateway {
  async find(id: string): Promise<Invoice> {
    const invoiceModel = await InvoiceModel.findByPk(id, {
      include: { model: ProductModel },
    });

    return SequelizeInvoiceMapper.toDomain(invoiceModel);
  }

  async create(data: Invoice): Promise<Invoice | void> {
    const invoiceModel = await InvoiceModel.create(
      SequelizeInvoiceMapper.toSequelize(data),
      { include: { model: ProductModel } }
    );

    return SequelizeInvoiceMapper.toDomain(invoiceModel);
  }
}
