import { uniqueId } from "lodash";
import { Pizza, OrderMisc, Address } from ".";

export default class Order {
  constructor(order) {
    this.id = order?.id || uniqueId();
    this.userId = order?.userId || null;
    this.addressId = order?.addressId || null;
    this.phone = order.phone;
    this.pizzas = Pizza.parseItems(order.orderPizzas);
    this.misc = order?.orderMisc ? OrderMisc.parseItems(order.orderMisc) : [];
    this.address = order?.orderAddress
      ? new Address(order?.orderAddress)
      : null;
  }

  static parseItem(it) {
    return new Order(it);
  }

  static parseItems(items) {
    return items.map(Order.parseItem);
  }

  static createNew() {
    return new Order({
      orderPizzas: [],
      orderMisc: [],
      orderAddress: null,
    });
  }
}
