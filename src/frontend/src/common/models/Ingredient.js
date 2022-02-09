export default class Ingredient {
  constructor(ingredient) {
    this.id = ingredient.id;
    this.name = ingredient.name;
    this.image = ingredient.image;
    this.price = ingredient.price;
    // client
    this.value = ingredient.image.slice(20, ingredient.image.length - 4);
    this.quantity = 0;
    this.displayName = ingredient.name.toLowerCase();
  }

  toRaw() {
    return {
      ingredientId: this.id,
      quantity: this.quantity,
    };
  }

  static parseItem(it) {
    return new Ingredient(it);
  }

  static parseItems(items) {
    return items.map(Ingredient.parseItem);
  }
}
