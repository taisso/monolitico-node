import Id from "../../../@shared/domain/value-object/id.value-object";
import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import ClientAdmFacadeInterface from "../../../client-adm/facade/client-adm.facade.interface";
import { IInvoiceFacade } from "../../../invoice/facade/invoice.facade.interface";
import PaymentFacadeInterface from "../../../payment/facade/facade.interface";
import ProductAdmFacadeInterface from "../../../product-adm/facade/product-adm.facade.interface";
import StoreCatalogFacadeInterface from "../../../store-catalog/facade/store-catalog.facade.interface";
import { Client } from "../../domain/client.entity";
import { Order } from "../../domain/order.entity";
import { Product } from "../../domain/product.entity";
import { ICheckoutGateway } from "../../gateway/checkout.gateway";
import {
  IPlaceOrderInputDto,
  IPlaceOrderOutputDto,
  IProductTypes,
} from "./place-order.dto";

export class PlaceOrderUsecase implements UseCaseInterface {
  constructor(
    private readonly clientFacade: ClientAdmFacadeInterface,
    private readonly productFacade: ProductAdmFacadeInterface,
    private readonly catalogFacade: StoreCatalogFacadeInterface,
    private readonly repository: ICheckoutGateway,
    private readonly invoiceFacade: IInvoiceFacade,
    private readonly paymentFacade: PaymentFacadeInterface
  ) {}

  async execute(input: IPlaceOrderInputDto): Promise<IPlaceOrderOutputDto> {
    const client = await this.clientFacade.find({ id: input.clientId });
    if (!client) {
      throw new Error("Client not found");
    }
    await this.validateProducts(input);

    const products = await Promise.all(
      input.products.map((p) => this.getProduct(p.productId))
    );

    const myClient = new Client({
      id: new Id(client.id),
      name: client.name,
      email: client.email,
      address: client.street,
    });

    const order = new Order({
      client: myClient,
      products,
    });

    const payment = await this.paymentFacade.process({
      orderId: order.id.id,
      amount: order.total,
    });

    const invoice =
      payment.status === "approved"
        ? await this.invoiceFacade.generate({
            name: client.name,
            document: client.document,
            street: client.street,
            number: client.number,
            city: client.city,
            state: client.state,
            zipCode: client.zipCode,
            complement: client.complement,
            items: products.map((product) => {
              return {
                id: product.id.id,
                name: product.name,
                price: product.salesPrice,
              };
            }),
          })
        : null;

    payment.status === "approved" && order.approved();
    await this.repository.addOrder(order);

    return {
      id: order.id.id,
      invoiceId: payment.status === "approved" ? invoice.id : null,
      status: order.status,
      total: order.total,
      products: order.products.map((p) => ({
        productId: p.id.id,
      })),
    };
  }

  private async validateProducts(input: IPlaceOrderInputDto): Promise<void> {
    if (input.products.length === 0) {
      throw new Error("No products selected");
    }

    await this.checkStockProduct(input.products);
  }

  private async checkStockProduct(products: IProductTypes[]) {
    for (const p of products) {
      const productId = p.productId;
      const product = await this.productFacade.checkStock({ productId });

      if (product.stock <= 0) {
        throw new Error(`Product ${productId} is not available in stock`);
      }
    }
  }

  private async getProduct(productId: string): Promise<Product> {
    const product = await this.catalogFacade.find({ id: productId });
    if (!product) {
      throw new Error("Product not found");
    }

    const productProps = {
      id: new Id(product.id),
      name: product.name,
      description: product.description,
      salesPrice: product.salesPrice,
    };

    return new Product(productProps);
  }
}
