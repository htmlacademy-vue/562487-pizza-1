import { uniqueId } from "lodash";

export default class Address {
  constructor(address) {
    this.id = address?.id || uniqueId();
    this.name = address.name;
    this.street = address.street;
    this.building = address.building;
    this.flat = address.flat;
    this.comment = address.comment;
    this.userId = address.userId;
  }

  toRaw() {
    return {
      name: this.name,
      street: this.street,
      building: this.building,
      flat: this.flat,
      comment: this.comment,
      userId: this.userId,
    };
  }

  static parseItem(it) {
    return new Address(it);
  }

  static parseItems(items) {
    return items.map(Address.parseItem);
  }
}
