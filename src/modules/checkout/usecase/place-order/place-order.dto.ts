export interface IProductTypes { productId: string }

export interface IPlaceOrderInputDto {
    clientId: string;
    products: IProductTypes[]
}

export interface IPlaceOrderOutputDto {
    id: string;
    invoiceId: string;
    status: string;
    total: number;
    products: IProductTypes[]
}