export default class Misc {
  constructor(misc) {
    this.id = misc.id;
    this.name = misc.name;
    this.image = misc.image;
    this.price = misc.price;
    // client
    this.quantity = 0;
  }

  toRaw() {
    return {
      miscId: this.id,
      quantity: this.quantity,
    };
  }

  static parseItem(it) {
    return new Misc(it);
  }

  static parseItems(items) {
    return items.map(Misc.parseItem);
  }
}
