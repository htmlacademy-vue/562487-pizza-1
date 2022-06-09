export default class PizzaIngredient {
  constructor(ingredient) {
    this.ingredientId = ingredient.ingredientId;
    this.quantity = ingredient.quantity;
  }

  static parseItem(it) {
    return new PizzaIngredient(it);
  }

  static parseItems(items) {
    return items.map(PizzaIngredient.parseItem);
  }
}
