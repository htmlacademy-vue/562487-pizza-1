import { findById, sum } from "@/common/helpers";
import { Dough, Sauce, Size, Ingredient } from "@/common/models";
import {
  SET_BUILDER_ENTITY,
  SET_BUILDER_PIZZA_ENTITY,
  UPDATE_BUILDER_PIZZA_INGREDIENTS,
  RESET_BUILDER_PIZZA,
} from "@/store/mutations-types";
import { Pizza } from "@/common/models";

export default {
  namespaced: true,
  state: {
    doughs: [],
    sizes: [],
    sauces: [],
    ingredients: [],
    pizza: Pizza.createNew(),
  },
  getters: {
    doughById: (state) => (id) => findById(state.doughs, id),
    sauceById: (state) => (id) => findById(state.sauces, id),
    sizeById: (state) => (id) => findById(state.sizes, id),
    ingredientById: (state) => (id) => findById(state.ingredients, id),
    doughPrice: (state) => findById(state.doughs, state.pizza.doughId).price,
    saucePrice: (state) => findById(state.sauces, state.pizza.sauceId).price,
    sizeMultiplier: (state) =>
      findById(state.sizes, state.pizza.sizeId).multiplier,
    ingredientsPrice: (state) =>
      state.pizza.ingredients
        .map(({ ingredientId, quantity }) => {
          const ingredient = findById(state.ingredients, ingredientId);
          return ingredient.price * quantity;
        })
        .reduce(sum, 0),
    pizzaIngredientById: (state) => (id) =>
      state.pizza.ingredients.find((it) => it.ingredientId === id),
    totalPrice: (state, getters) =>
      getters.isLoading
        ? 0
        : (getters.doughPrice + getters.saucePrice + getters.ingredientsPrice) *
            getters.sizeMultiplier || 0,
    builderPizzaPrice: (state, getters) => {
      return getters.isLoading ? 0 : getters.pizzaPrice(state.pizza);
    },
    pizzaPrice: (state) => (pizza) => {
      const { doughId, sauceId, sizeId, ingredients } = pizza;
      const doughPrice = findById(state.doughs, doughId).price;
      const saucePrice = findById(state.sauces, sauceId).price;
      const sizeMultiplier = findById(state.sizes, sizeId).multiplier;
      const ingredientsPrice = ingredients
        .map(({ ingredientId, quantity }) => {
          const ingredient = findById(state.ingredients, ingredientId);
          return ingredient.price * quantity;
        })
        .reduce(sum, 0);
      const totalPrice =
        (doughPrice + saucePrice + ingredientsPrice) * sizeMultiplier;
      return totalPrice;
    },
    isLoading: (state) =>
      !state.doughs.length ||
      !state.sizes.length ||
      !state.sauces.length ||
      !state.ingredients.length,
  },

  mutations: {
    [SET_BUILDER_ENTITY](state, { entity, value }) {
      if (entity === "pizza") {
        state[entity] = new Pizza(value);
      } else {
        state[entity] = value;
      }
    },
    [SET_BUILDER_PIZZA_ENTITY](state, { entity, value }) {
      state.pizza[entity] = value;
    },
    [UPDATE_BUILDER_PIZZA_INGREDIENTS](state, ingredient) {
      const index = state.pizza.ingredients.findIndex(
        (it) => it.ingredientId === ingredient.ingredientId
      );
      if (~index) {
        if (!ingredient.quantity) {
          state.pizza.ingredients.splice(index, 1);
        } else {
          state.pizza.ingredients.splice(index, 1, ingredient);
        }
      } else {
        state.pizza.ingredients.push(ingredient);
      }
    },
    [RESET_BUILDER_PIZZA](state) {
      state.pizza = Pizza.createNew();
    },
  },

  actions: {
    async fetchDoughs({ commit }) {
      const data = await this.$api.dough.query();
      const doughs = Dough.parseItems(data);
      commit(SET_BUILDER_ENTITY, {
        entity: "doughs",
        value: doughs,
      });
    },
    async fetchSizes({ commit }) {
      const data = await this.$api.sizes.query();
      const sizes = Size.parseItems(data);
      commit(SET_BUILDER_ENTITY, {
        entity: "sizes",
        value: sizes,
      });
    },
    async fetchSauces({ commit }) {
      const data = await this.$api.sauces.query();
      const sauces = Sauce.parseItems(data);
      commit(SET_BUILDER_ENTITY, {
        entity: "sauces",
        value: sauces,
      });
    },
    async fetchIngredients({ commit }) {
      const data = await this.$api.ingredients.query();
      const ingredients = Ingredient.parseItems(data);
      commit(SET_BUILDER_ENTITY, {
        entity: "ingredients",
        value: ingredients,
      });
    },
  },
};
