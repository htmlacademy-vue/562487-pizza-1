import { uniqueId } from "lodash";

export default class Address {
  constructor(address) {
    this.id = address?.id || uniqueId("address_");
    this.name = address.name;
    this.street = address.street;
    this.building = address.building;
    this.flat = address.flat;
    this.comment = address.comment;
  }

  toRaw() {
    return {
      name: this.name,
      street: this.street,
      building: this.building,
      flat: this.flat,
      comment: this.comment,
    };
  }

  static parseItem(it) {
    return new Address(it);
  }

  static parseItems(items) {
    return items.map(Address.parseItem);
  }

  static createNew() {
    return new Address({
      name: "",
      street: "",
      building: "",
      flat: "",
      comment: "",
    });
  }
}
