import ValueObject from "./value-object.interface";

type AddressProps = {
  street: string;
  number: string;
  complement: string;
  city: string;
  state: string;
  zipCode: string;
};

export class Address implements ValueObject {
  private props: AddressProps;

  constructor(props: AddressProps) {
    this.props = props;
  }

  get value(): AddressProps {
    return this.props;
  }
}
