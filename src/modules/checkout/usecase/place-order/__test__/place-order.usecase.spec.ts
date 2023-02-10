import Id from "../../../../@shared/domain/value-object/id.value-object";
import { Product } from "../../../domain/product.entity";
import { IPlaceOrderInputDto, IProductTypes } from "../place-order.dto";
import { PlaceOrderUsecase } from "../place-order.usecase";
import { clientFacadeFaker } from "./faker/client-facade.faker";
import { productFaker } from "./faker/product-facade.faker";

const mockDate = new Date(2000, 1, 1);

const mockClientFacade = (clientFaker = clientFacadeFaker()) => {
  return {
    find: jest.fn().mockResolvedValue(clientFaker),
    add: jest.fn(),
  };
};

const mockProductFacade = () => {
  return {
    checkStock: jest.fn(({ productId }: { productId: string }) => {
      return Promise.resolve({ productId, stock: 1 });
    }),
    addProduct: jest.fn(),
  };
};

const mockCatalogFacade = () => {
  return {
    find: jest.fn().mockResolvedValue(productFaker()),
    findAll: jest.fn(),
  };
};

const mockCheckoutRepo = () => {
  return {
    findOrder: jest.fn(),
    addOrder: jest.fn(),
  };
};

const mockInvoiceFacade = () => {
  return {
    find: jest.fn(),
    generate: jest.fn().mockResolvedValue({ id: "any_id" }),
  };
};

const mockPaymentFacade = () => {
  return {
    process: jest.fn(),
  };
};

const makeSut = () => {
  const mockClient = mockClientFacade();
  const mockProduct = mockProductFacade();
  const mockCatalog = mockCatalogFacade();
  const mockCheckout = mockCheckoutRepo();
  const mockInvoice = mockInvoiceFacade();
  const mockPayment = mockPaymentFacade();
  const placeOrderUseCase = new PlaceOrderUsecase(
    mockClient,
    mockProduct,
    mockCatalog,
    mockCheckout,
    mockInvoice,
    mockPayment
  );
  return {
    placeOrderUseCase,
    mockClient,
    mockProduct,
    mockCatalog,
    mockPayment,
    mockCheckout,
    mockInvoice,
  };
};

describe("PlaceOrderUseCase unit test", () => {
  describe("validateProducts method", () => {
    const validateProducts = (
      placeOrderUseCase: PlaceOrderUsecase,
      input: IPlaceOrderInputDto
    ) => placeOrderUseCase["validateProducts"](input);

    it("should throw error if no products are selected", async () => {
      const { placeOrderUseCase } = makeSut();

      const input: IPlaceOrderInputDto = {
        clientId: "any_id",
        products: [],
      };

      const validateProducts = placeOrderUseCase["validateProducts"](input);

      await expect(validateProducts).rejects.toThrow(
        new Error("No products selected")
      );
    });

    it("should throw an error when product is out of stock", async () => {
      const { placeOrderUseCase, mockProduct } = makeSut();
      jest
        .spyOn(mockProduct, "checkStock")
        .mockImplementation(({ productId }: IProductTypes) =>
          Promise.resolve({
            productId: productId,
            stock: productId === "1" ? 0 : 1,
          })
        );

      let input: IPlaceOrderInputDto = {
        clientId: "any_id",
        products: [{ productId: "1" }],
      };

      let result = validateProducts(placeOrderUseCase, input);
      await expect(result).rejects.toThrow(
        new Error("Product 1 is not available in stock")
      );

      input = {
        clientId: "any_id",
        products: [{ productId: "0" }, { productId: "1" }],
      };

      result = validateProducts(placeOrderUseCase, input);
      await expect(result).rejects.toThrow(
        new Error("Product 1 is not available in stock")
      );
      expect(mockProduct.checkStock).toHaveBeenCalledTimes(3);
    });
  });

  describe("getProducts method", () => {
    beforeAll(() => {
      jest.useFakeTimers("modern");
      jest.setSystemTime(mockDate);
    });

    afterAll(() => {
      jest.useRealTimers();
    });

    it("should throw an error when product not found", async () => {
      const { placeOrderUseCase, mockCatalog } = makeSut();
      jest.spyOn(mockCatalog, "find").mockResolvedValue(null);

      const getProducts = placeOrderUseCase["getProduct"]("0");

      await expect(getProducts).rejects.toThrow(new Error("Product not found"));
    });

    it("should return a product", async () => {
      const { placeOrderUseCase, mockCatalog } = makeSut();
      const product = productFaker();
      jest.spyOn(mockCatalog, "find").mockResolvedValue(product);

      const getProducts = placeOrderUseCase["getProduct"]("0");

      await expect(getProducts).resolves.toEqual(
        new Product({
          id: new Id(product.id),
          name: product.name,
          description: product.description,
          salesPrice: product.salesPrice,
        })
      );
      expect(mockCatalog.find).toHaveBeenCalledTimes(1);
    });
  });

  describe("execute method", () => {
    beforeAll(() => {
      jest.useFakeTimers("modern");
      jest.setSystemTime(mockDate);
    });

    afterAll(() => {
      jest.useRealTimers();
    });

    it("should throw an error when client not found", async () => {
      const { placeOrderUseCase, mockClient } = makeSut();
      jest.spyOn(mockClient, "find").mockResolvedValue(null);

      const input: IPlaceOrderInputDto = {
        clientId: "any_id",
        products: [],
      };

      await expect(placeOrderUseCase.execute(input)).rejects.toThrow(
        new Error("Client not found")
      );
    });

    it("should throw an error when products are not valid", async () => {
      const { placeOrderUseCase } = makeSut();

      const error = () => new Error("No products selected");
      const mockValidateProducts = jest
        .spyOn(placeOrderUseCase as any, "validateProducts")
        .mockRejectedValue(error());

      const input: IPlaceOrderInputDto = {
        clientId: "any_id",
        products: [],
      };

      await expect(placeOrderUseCase.execute(input)).rejects.toThrow(error());
      expect(mockValidateProducts).toHaveBeenCalledTimes(1);
    });

    describe("place an order", () => {
      const {
        placeOrderUseCase,
        mockClient,
        mockPayment,
        mockCheckout,
        mockInvoice,
      } = makeSut();

      const products = {
        "1": new Product({
          id: new Id("1"),
          name: "Product 1",
          description: "some description",
          salesPrice: 40,
        }),
        "2": new Product({
          id: new Id("2"),
          name: `Product 2`,
          description: "some description",
          salesPrice: 30,
        }),
      };

      const mockValidateProducts = jest
        .spyOn(placeOrderUseCase as any, "validateProducts")
        .mockResolvedValue(null);

      const mockGetProduct = jest
        .spyOn(placeOrderUseCase as any, "getProduct")
        //@ts-expect-error
        .mockImplementation((productId: keyof typeof products) => {
          return products[productId];
        });

      it("should not be approved", async () => {
        jest.spyOn(mockPayment, "process").mockReturnValue({
          transactionId: "any_id",
          orderId: "any_id",
          amount: 100,
          status: "error",
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        const input: IPlaceOrderInputDto = {
          clientId: "any_id",
          products: [{ productId: "1" }, { productId: "2" }],
        };

        let output = await placeOrderUseCase.execute(input);

        expect(output.invoiceId).toBeNull();
        expect(output.total).toBe(70);
        expect(output.products).toStrictEqual(input.products);
        expect(mockClient.find).toHaveBeenCalledTimes(1);
        expect(mockClient.find).toHaveBeenCalledWith({ id: "any_id" });
        expect(mockValidateProducts).toHaveBeenCalledTimes(1);
        expect(mockGetProduct).toHaveBeenCalledTimes(2);
        expect(mockCheckout.addOrder).toHaveBeenCalledTimes(1);
        expect(mockPayment.process).toHaveBeenCalledTimes(1);
        expect(mockPayment.process).toHaveBeenCalledWith({
          orderId: output.id,
          amount: output.total,
        });
        expect(mockInvoice.generate).toHaveBeenCalledTimes(0);
      });

      it("should be approved", async () => {
        const clientProps = clientFacadeFaker()
        jest.spyOn(mockClient, 'find').mockResolvedValue(clientProps)


        jest.spyOn(mockPayment, "process").mockReturnValue({
          transactionId: "any_id",
          orderId: "any_id",
          amount: 100,
          status: "approved",
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        const input: IPlaceOrderInputDto = {
            clientId: "1c",
            products: [{ productId: "1" }, { productId: "2" }],
        };

        let output = await placeOrderUseCase.execute(input);

        expect(output.invoiceId).toBe("any_id");
        expect(output.total).toBe(70);
        expect(output.products).toStrictEqual(input.products);
        expect(mockClient.find).toHaveBeenCalledTimes(1);
        expect(mockClient.find).toHaveBeenCalledWith({id: "1c"});
        expect(mockValidateProducts).toHaveBeenCalledTimes(1);
        expect(mockGetProduct).toHaveBeenCalledTimes(2);
        expect(mockCheckout.addOrder).toHaveBeenCalledTimes(1);
        expect(mockPayment.process).toHaveBeenCalledTimes(1);
        expect(mockPayment.process).toHaveBeenCalledWith({
            orderId: output.id,
            amount: output.total,
        });
        expect(mockInvoice.generate).toHaveBeenCalledTimes(1);
        expect(mockInvoice.generate).toHaveBeenCalledWith({
            name: clientProps.name,
            document: clientProps.document,
            street: clientProps.street,
            number: clientProps.number,
            complement: clientProps.complement,
            city: clientProps.city,
            state: clientProps.state,
            zipCode: clientProps.zipCode,
            items: [
                {
                    id: products["1"].id.id,
                    name: products["1"].name,
                    price: products["1"].salesPrice,
                },
                {
                    id: products["2"].id.id,
                    name: products["2"].name,
                    price: products["2"].salesPrice,
                },
            ],
        });
    });


    });
  });
});
