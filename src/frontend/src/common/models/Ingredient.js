export default class Ingredient {
  constructor(ingredient) {
    this.ingredientId = ingredient.id;
    this.name = ingredient.name;
    this.image = ingredient.image;
    this.price = ingredient.price;
    // client
    this.value = ingredient.image.slice(20, ingredient.image.length - 4);
    this.displayName = ingredient.name.toLowerCase();
  }

  static parseItem(it) {
    return new Ingredient(it);
  }

  static parseItems(items) {
    return items.map(Ingredient.parseItem);
  }
}
