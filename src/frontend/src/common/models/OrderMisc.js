export default class OrderMisc {
  constructor(misc) {
    this.miscId = misc.miscId;
    this.quantity = misc.quantity;
  }

  static parseItem(it) {
    return new OrderMisc(it);
  }

  static parseItems(items) {
    return items.map(OrderMisc.parseItem);
  }
}
