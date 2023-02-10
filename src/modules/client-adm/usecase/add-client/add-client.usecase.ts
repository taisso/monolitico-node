import ClientGateway from "../../gateway/client.gateway";
import {AddClientInputDto, AddClientOutputDto} from "./add-client.usecase.dto";
import Client from "../../domain/client.entity";
import Id from "../../../@shared/domain/value-object/id.value-object";
import { Address } from "../../../@shared/domain/value-object/address.value-object";

export default class AddClientUseCase {
    private _clientRepository: ClientGateway

    constructor(clientRepository: ClientGateway) {
        this._clientRepository = clientRepository;
    }

    async execute(input: AddClientInputDto): Promise<AddClientOutputDto> {
        const props = {
            id: new Id(input.id) || new Id(),
            name: input.name,
            email: input.email,
            document: input.document,
            address: new Address({
                street: input.street,
                number: input.number,
                complement: input.complement,
                city: input.city,
                state: input.state,
                zipCode: input.zipCode,
            })
        };

        const client = new Client(props);

        this._clientRepository.add(client);

        return {
            id: client.id.id,
            name: client.name,
            email: client.email,
            document: client.document,
            street: client.address.value.street,
            number: client.address.value.number,
            complement: client.address.value.complement,
            city: client.address.value.city,
            state: client.address.value.state,
            zipCode: client.address.value.zipCode,
            createdAt: client.createdAt,
            updatedAt: client.updatedAt,
        }
    }
}