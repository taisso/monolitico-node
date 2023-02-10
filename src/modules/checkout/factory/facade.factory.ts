import ClientAdmFacadeFactory from "../../client-adm/factory/client-adm.facade.factory";
import InvoiceFacadeFactory from "../../invoice/factory/facade.factory";
import PaymentFacadeFactory from "../../payment/factory/payment.facade.factory";
import ProductAdmFacadeFactory from "../../product-adm/factory/facade.factory";
import StoreCatalogFacadeFactory from "../../store-catalog/factory/facade.factory";
import { PlaceOrderFacade } from "../facade/checkout.facade";
import IPlaceOrderFacade from "../facade/checkout.facade.interface";
import { ICheckoutGateway } from "../gateway/checkout.gateway";
import { PlaceOrderUsecase } from "../usecase/place-order/place-order.usecase";

export default class PlaceOrderFacadeFactory {
  static createWithCustomRepo(repo: ICheckoutGateway): IPlaceOrderFacade {
    const clientFacade = ClientAdmFacadeFactory.create();
    const productFacade = ProductAdmFacadeFactory.create();
    const catalogFacade = StoreCatalogFacadeFactory.create();
    const invoiceFacade = InvoiceFacadeFactory.create();
    const paymentFacade = PaymentFacadeFactory.create();

    const placeOrderUseCase = new PlaceOrderUsecase(
      clientFacade,
      productFacade,
      catalogFacade,
      repo,
      invoiceFacade,
      paymentFacade
    );

    return new PlaceOrderFacade({ placeOrderUseCase });
  }
}
