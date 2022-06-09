import { uniqueId } from "lodash";
import PizzaIngredient from "./PizzaIngredient";

export default class Pizza {
  constructor(pizza) {
    this.id = pizza?.id || uniqueId("pizza_");
    this.name = pizza.name;
    this.doughId = pizza.doughId;
    this.sauceId = pizza.sauceId;
    this.sizeId = pizza.sizeId;
    this.ingredients = PizzaIngredient.parseItems(pizza.ingredients);
    this.quantity = pizza.quantity;
  }

  toRaw() {
    return {
      name: this.name,
      doughId: this.doughId,
      sauceId: this.sauceId,
      sizeId: this.sizeId,
      ingredients: this.ingredients,
      quantity: this.quantity,
    };
  }

  static parseItem(pizza) {
    return new Pizza(pizza);
  }

  static parseItems(pizzas) {
    return pizzas.map(Pizza.parseItem);
  }

  static createNew() {
    return new Pizza({
      name: "",
      doughId: 1,
      sauceId: 1,
      sizeId: 2,
      ingredients: [],
      quantity: 1,
    });
  }
}
