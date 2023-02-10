import { Address } from "../../../@shared/domain/value-object/address.value-object";
import Id from "../../../@shared/domain/value-object/id.value-object";
import FindClientUseCase from "./find-client.usecase";

const client = {
  id: new Id("1"),
  name: "Client 1",
  email: "x@x.com",
  document: "123456789",
  address: new Address({
    street: "Address 1",
    number: "1",
    complement: "Complement 1",
    city: "City 1",
    state: "State 1",
    zipCode: "ZipCode 1",
  }),
};

const MockRepository = () => {
  return {
    add: jest.fn(),
    find: jest.fn().mockReturnValue(Promise.resolve(client)),
  };
};

describe("find client usecase test", () => {
  it("should find a client", async () => {
    const repository = MockRepository();
    const usecase = new FindClientUseCase(repository);

    const input = {
      id: "1",
    };

    const result = await usecase.execute(input);

    expect(repository.find).toHaveBeenCalled();
    expect(result.id).toBe(input.id);
    expect(result.name).toBe(client.name);
    expect(result.email).toBe(client.email);
    expect(result.document).toBe(client.document);
    expect(result.street).toBe(client.address.value.street);
    expect(result.number).toBe(client.address.value.number);
    expect(result.complement).toBe(client.address.value.complement);
    expect(result.city).toBe(client.address.value.city);
    expect(result.state).toBe(client.address.value.state);
    expect(result.zipCode).toBe(client.address.value.zipCode);
  });
});
