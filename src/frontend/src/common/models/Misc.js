export default class Misc {
  constructor(misc) {
    this.miscId = misc.id;
    this.name = misc.name;
    this.image = misc.image;
    this.price = misc.price;
  }

  toRaw() {
    return {
      miscId: this.miscId,
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
