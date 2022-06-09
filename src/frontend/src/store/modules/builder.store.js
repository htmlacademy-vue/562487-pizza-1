import { findById, sum } from "@/common/helpers";
import { Dough, Sauce, Size, Ingredient } from "@/common/models";
import {
  SET_BUILDER_ENTITY,
  SET_BUILDER_PIZZA_ENTITY,
  ADD_BUILDER_PIZZA_INGREDIENT,
  REMOVE_BUILDER_PIZZA_INGREDIENT,
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
    ingredientById: (state) => (id) =>
      state.ingredients.find((it) => it.ingredientId === id),
    doughPriceById: (state, getters) => (id) => getters.doughById(id).price,
    doughPrice: (state, getters) => getters.doughPriceById(state.pizza.doughId),
    saucePriceById: (state, getters) => (id) => getters.sauceById(id).price,
    saucePrice: (state, getters) => getters.saucePriceById(state.pizza.sauceId),
    sizeMultiplierById: (state, getters) => (id) =>
      getters.sizeById(id).multiplier,
    sizeMultiplier: (state, getters) =>
      getters.sizeMultiplierById(state.pizza.sizeId),
    ingredientPriceById:
      (state, getters) =>
      ({ ingredientId }) =>
        getters.ingredientById(ingredientId).price,
    ingredientsPrice: (state, getters) => (ingredients) =>
      ingredients.map(getters.ingredientPriceById).reduce(sum, 0),
    ingredientQuantityById: (state) => (id) =>
      state.pizza.ingredients.filter((it) => it.ingredientId === id).length,
    pizzaPrice: (state, getters) => (pizza) => {
      if (getters.isLoading) {
        return 0;
      }
      const { doughId, sauceId, sizeId, ingredients } = pizza;
      const doughPrice = getters.doughPriceById(doughId);
      const saucePrice = getters.saucePriceById(sauceId);
      const sizeMultiplier = getters.sizeMultiplierById(sizeId);
      const ingredientsPrice = getters.ingredientsPrice(ingredients);
      return (doughPrice + saucePrice + ingredientsPrice) * sizeMultiplier;
    },
    builderPizzaPrice: (state, getters) =>
      getters.isLoading
        ? 0
        : (getters.doughPrice + getters.saucePrice + getters.ingredientsPrice) *
          getters.sizeMultiplier,
    pizzasPrice: (state, getters) => (pizzas) =>
      pizzas
        .map((pizza) => getters.pizzaPrice(pizza) * pizza.quantity)
        .reduce(sum, 0),
    isLoading: (state) => {
      return (
        !state.doughs.length ||
        !state.sizes.length ||
        !state.sauces.length ||
        !state.ingredients.length
      );
    },
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
    [ADD_BUILDER_PIZZA_INGREDIENT](state, { ingredientId, quantity }) {
      state.pizza.ingredients.push({ ingredientId, quantity });
    },
    [REMOVE_BUILDER_PIZZA_INGREDIENT](state, ingredient) {
      const lastIndex = state.pizza.ingredients
        .map((it) => it.ingredientId)
        .lastIndexOf(ingredient.ingredientId);

      if (~lastIndex) {
        state.pizza.ingredients.splice(lastIndex, 1);
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
      const sortedSizes = sizes
        .slice()
        .sort((size1, size2) => size1.multiplier - size2.multiplier);
      commit(SET_BUILDER_ENTITY, {
        entity: "sizes",
        value: sortedSizes,
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
