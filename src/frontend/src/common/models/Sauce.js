import { PizzaSauces } from "@/common/enums";

export default class Sauce {
  constructor(sauce) {
    this.id = sauce.id;
    this.name = sauce.name;
    this.price = sauce.price;
    // client
    this.value = PizzaSauces[sauce.id];
    this.kind = "sauce";
    this.displayName = sauce.name.toLowerCase();
  }

  static parseItem(it) {
    return new Sauce(it);
  }

  static parseItems(items) {
    return items.map(Sauce.parseItem);
  }
}
