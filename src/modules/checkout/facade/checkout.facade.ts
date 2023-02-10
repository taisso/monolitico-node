import { PlaceOrderUsecase } from "../usecase/place-order/place-order.usecase";
import IPlaceOrderFacade, {
  IPlaceOrderFacadeInputDto,
  IPlaceOrderFacadeOutputDto,
} from "./checkout.facade.interface";

export interface UseCaseProps {
  placeOrderUseCase: PlaceOrderUsecase;
}

export class PlaceOrderFacade implements IPlaceOrderFacade {
  private readonly _placeOrderUseCase: PlaceOrderUsecase;

  constructor(props: UseCaseProps) {
    this._placeOrderUseCase = props.placeOrderUseCase;
  }

  create(
    input: IPlaceOrderFacadeInputDto
  ): Promise<IPlaceOrderFacadeOutputDto> {
    return this._placeOrderUseCase.execute(input);
  }
}
