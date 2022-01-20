import { findById } from "@/common/helpers";
import { Dough, Sauce, Size, Ingredient } from "@/common/models";
import {
  SET_ENTITY,
  SET_PIZZA_ENTITY,
  UPDATE_PIZZA_INGREDIENTS,
  SET_PIZZA,
  RESET_PIZZA,
} from "@/store/mutations-types";
import { cloneDeep } from "lodash";

const MODULE = "Builder";

const createNewPizza = () => ({
  name: "",
  doughId: 1,
  sauceId: 1,
  sizeId: 2,
  ingredients: [],
  quantity: 1,
});

export default {
  namespaced: true,
  state: {
    doughs: [],
    sizes: [],
    sauces: [],
    ingredients: [],
    pizza: createNewPizza(),
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
        .reduce((acc, it) => acc + it, 0),
    totalPrice: (state, getters) =>
      (getters.doughPrice + getters.saucePrice + getters.ingredientsPrice) *
      getters.sizeMultiplier,
  },

  mutations: {
    [SET_PIZZA_ENTITY](state, { name, value }) {
      state.pizza[name] = value;
    },
    [UPDATE_PIZZA_INGREDIENTS](state, ingredient) {
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
    [SET_PIZZA](state, pizza) {
      state.pizza = cloneDeep(pizza);
    },
    [RESET_PIZZA](state) {
      state.pizza = createNewPizza();
    },
  },

  actions: {
    async fetchDoughs({ commit }) {
      const data = await this.$api.dough.query();
      const doughs = Dough.parseItems(data);
      commit(
        SET_ENTITY,
        {
          module: MODULE,
          entity: "doughs",
          value: doughs,
        },
        { root: true }
      );
    },
    async fetchSizes({ commit }) {
      const data = await this.$api.sizes.query();
      const sizes = Size.parseItems(data);
      commit(
        SET_ENTITY,
        {
          module: MODULE,
          entity: "sizes",
          value: sizes,
        },
        { root: true }
      );
    },
    async fetchSauces({ commit }) {
      const data = await this.$api.sauces.query();
      const sauces = Sauce.parseItems(data);
      commit(
        SET_ENTITY,
        {
          module: MODULE,
          entity: "sauces",
          value: sauces,
        },
        { root: true }
      );
    },
    async fetchIngredients({ commit }) {
      const data = await this.$api.ingredients.query();
      const ingredients = Ingredient.parseItems(data);
      commit(
        SET_ENTITY,
        {
          module: MODULE,
          entity: "ingredients",
          value: ingredients,
        },
        { root: true }
      );
    },
  },
};
