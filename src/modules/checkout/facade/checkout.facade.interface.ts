export interface IProductFacadeTypes {
  productId: string;
}

export interface IPlaceOrderFacadeInputDto {
  clientId: string;
  products: IProductFacadeTypes[];
}

export interface IPlaceOrderFacadeOutputDto {
  id: string;
  invoiceId: string;
  status: string;
  total: number;
  products: IProductFacadeTypes[];
}

export default interface IPlaceOrderFacade {
  create(input: IPlaceOrderFacadeInputDto): Promise<IPlaceOrderFacadeOutputDto>;
}
