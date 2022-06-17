import { SET_ENTITY } from "@/store/mutations-types";
import { Dough, Sauce, Size, Ingredient } from "@/common/models";
import pizzaData from "@/static/pizza.json";

export const setDoughs = (store) => {
  store.commit(SET_ENTITY, {
    module: "Builder",
    entity: "doughs",
    value: Dough.parseItems(pizzaData.dough),
  });
};

export const setSauces = (store) => {
  store.commit(SET_ENTITY, {
    module: "Builder",
    entity: "sauces",
    value: Sauce.parseItems(pizzaData.sauces),
  });
};

export const setSizes = (store) => {
  store.commit(SET_ENTITY, {
    module: "Builder",
    entity: "sizes",
    value: Size.parseItems(pizzaData.sizes),
  });
};

export const setIngredients = (store) => {
  store.commit(SET_ENTITY, {
    module: "Builder",
    entity: "ingredients",
    value: Ingredient.parseItems(pizzaData.ingredients),
  });
};

export const addIngredient = (store, ingredient) => {
  store.commit("Builder/ADD_BUILDER_PIZZA_INGREDIENT", ingredient);
};
