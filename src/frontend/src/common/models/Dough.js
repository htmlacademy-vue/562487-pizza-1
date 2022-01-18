import { PizzaDoughs } from "@/common/enums";

export default class Dough {
  constructor(dough) {
    this.id = dough.id;
    this.name = dough.name;
    this.image = dough.image;
    this.description = dough.description;
    this.price = dough.price;
    // client
    this.value = PizzaDoughs[dough.id];
    this.kind = "dough";
    this.displayName = dough.name.replace(/.$/, "м").toLowerCase();
  }

  static parseItem(it) {
    return new Dough(it);
  }

  static parseItems(items) {
    return items.map(Dough.parseItem);
  }
}
