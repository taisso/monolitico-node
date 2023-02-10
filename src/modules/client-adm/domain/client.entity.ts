import Id from "../../@shared/domain/value-object/id.value-object";
import BaseEntity from "../../@shared/domain/entity/base.entity";
import AggregateRoot from "../../@shared/domain/entity/aggregate-root.interface";
import { Address } from "../../@shared/domain/value-object/address.value-object";

type ClientProps = {
  id?: Id;
  name: string;
  document: string;
  email: string;
  address: Address;
};

export default class Client extends BaseEntity implements AggregateRoot {
  private _name: string;
  private _document: string;
  private _email: string;
  private _address: Address;

  constructor(props: ClientProps) {
    super(props.id);
    this._name = props.name;
    this._document = props.document;
    this._email = props.email;
    this._address = props.address;
  }

  get name(): string {
    return this._name;
  }

  get document(): string {
    return this._document;
  }

  get email(): string {
    return this._email;
  }

  get address(): Address {
    return this._address;
  }
}
