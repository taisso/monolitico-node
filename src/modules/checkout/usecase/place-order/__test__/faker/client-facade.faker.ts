import { faker } from "@faker-js/faker";
import { FindClientFacadeOutputDto } from "../../../../../client-adm/facade/client-adm.facade.interface";

export const clientFacadeFaker = (): FindClientFacadeOutputDto => {
  return {
    id: faker.datatype.uuid(),
    name: faker.internet.userName(),
    email: faker.internet.email(),
    street: faker.address.street(),
    city: faker.address.city(),
    complement: 'any_complement',
    document: 'any_document',
    number: 'any_number',
    state: faker.address.state(),
    zipCode: faker.address.zipCode(),
  };
};
