import { PizzaIngredients } from "@/common/enums";

export default class Ingredient {
  constructor(ingredient) {
    this.id = ingredient.id;
    this.name = ingredient.name;
    this.image = ingredient.image;
    this.price = ingredient.price;
    // client
    this.value = PizzaIngredients[ingredient.id];
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
