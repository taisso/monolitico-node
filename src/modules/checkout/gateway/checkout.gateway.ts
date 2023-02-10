import { Order } from "../domain/order.entity"

export interface ICheckoutGateway {
    addOrder(order: Order): Promise<void>
    findOrder(id: string): Promise<Order | null>
}