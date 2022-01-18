import { PizzaSizes } from "@/common/enums";

export default class Size {
  constructor(size) {
    this.id = size.id;
    this.name = size.name;
    this.image = size.image;
    this.multiplier = size.multiplier;
    // client
    this.value = PizzaSizes[size.id];
    this.kind = "diameter";
    this.displayName = size.name;
  }

  static parseItem(it) {
    return new Size(it);
  }

  static parseItems(items) {
    return items.map(Size.parseItem);
  }
}
