export default class OrderMisc {
  constructor(orderMisc) {
    this.miscId = orderMisc?.miscId;
    this.quantity = orderMisc.quantity;
  }

  static parseItem(it) {
    return new OrderMisc(it);
  }

  static parseItems(items) {
    return items.map(OrderMisc.parseItem);
  }
}
