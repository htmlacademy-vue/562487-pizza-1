export default class Order {
  constructor(order) {
    this.id = order.id;
    this.userId = order.userId;
    this.pizzas = order.orderPizzas;
    this.misc = order.orderMisc;
    this.address = order.orderAddress;
  }

  static parseItem(it) {
    return new Order(it);
  }

  static parseItems(items) {
    return items.map(Order.parseItem);
  }
}
