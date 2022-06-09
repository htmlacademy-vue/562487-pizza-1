import Address from "./Address";
import OrderMisc from "./OrderMisc";

export default class Order {
  constructor(order) {
    this.id = order.id;
    this.userId = order.userId;
    this.phone = order?.phone || "";
    this.orderPizzas = order.orderPizzas;
    this.orderMisc = order?.orderMisc
      ? OrderMisc.parseItems(order.orderMisc)
      : [];
    this.orderAddress = order?.orderAddress
      ? new Address(order.orderAddress)
      : null;
  }

  static parseItem(it) {
    return new Order(it);
  }

  static parseItems(items) {
    return items.map(Order.parseItem);
  }
}
