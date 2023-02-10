import { faker } from "@faker-js/faker";
import { FindStoreCatalogFacadeOutputDto } from "../../../../../store-catalog/facade/store-catalog.facade.interface";

export const productFaker = (): FindStoreCatalogFacadeOutputDto => {
  return {
    id: faker.datatype.uuid(),
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    salesPrice: +faker.commerce.price(),
  };
};
