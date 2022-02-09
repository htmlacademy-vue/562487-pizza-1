import {
  SET_CART_ENTITY,
  SET_CART_ORDER_ENTITY,
  SET_CART_ORDER_ADDRESS_ENTITY,
  ADD_PIZZA,
  UPDATE_PIZZA,
  DELETE_PIZZA,
  UPDATE_PIZZA_QUANTITY,
  UPDATE_CART_ORDER_MISC,
  RESET_CART,
} from "@/store/mutations-types";
import { Misc, Pizza } from "@/common/models";
import { findById } from "@/common/helpers";
import { Order } from "@/common/models";
import { BASE_DELIVERIES } from "@/common/constants";

export default {
  namespaced: true,
  state: {
    misc: [],
    deliveries: BASE_DELIVERIES,
    delivery: BASE_DELIVERIES[0].id,
    phone: "",
    order: Order.createNew(),
  },
  getters: {
    miscById: (state) => (id) => findById(state.misc, id),
    miscQuantityById: (state) => (id) =>
      state.order.misc.find((it) => it.miscId === id)?.quantity || 0,
    orderPizzaById: (state) => (id) => findById(state.order.pizzas, id),
    pizzasPrice: (state, getters, rootState, rootGetters) => {
      return state.order.pizzas
        .map(
          (pizza) => rootGetters["Builder/pizzaPrice"](pizza) * pizza.quantity
        )
        .reduce((acc, it) => acc + it, 0);
    },
    miscPrice: (state) =>
      state.order.misc
        .map(({ miscId, quantity }) => {
          const miscItem = findById(state.misc, miscId);
          return miscItem.price * quantity;
        })
        .reduce((acc, it) => acc + it, 0),
    totalSum: (state, getters) => getters.pizzasPrice + getters.miscPrice,
    isEmpty: (state) => state.order.pizzas.length === 0,
  },
  mutations: {
    [SET_CART_ENTITY](state, { entity, value }) {
      state[entity] = value;
    },
    [SET_CART_ORDER_ENTITY](state, { entity, value }) {
      state.order[entity] = value;
    },
    [ADD_PIZZA](state, pizza) {
      const newPizza = new Pizza(pizza);
      state.order.pizzas.push(newPizza);
    },
    [UPDATE_PIZZA](state, pizza) {
      const index = state.order.pizzas.findIndex((it) => it.id === pizza.id);
      if (~index) {
        state.order.pizzas.splice(index, 1, pizza);
      }
    },
    [DELETE_PIZZA](state, id) {
      const index = state.order.pizzas.findIndex((it) => it.id === id);
      if (~index) {
        state.order.pizzas.splice(index, 1);
      }
    },
    [UPDATE_PIZZA_QUANTITY](state, { id, quantity }) {
      const index = state.order.pizzas.findIndex((it) => it.id === id);
      if (~index) {
        state.order.pizzas[index].quantity = quantity;
      }
    },
    [UPDATE_CART_ORDER_MISC](state, misc) {
      const index = state.order.misc.findIndex(
        (it) => it.miscId === misc.miscId
      );
      if (~index) {
        if (!misc.quantity) {
          state.order.misc.splice(index, 1);
        } else {
          state.order.misc.splice(index, 1, misc);
        }
      } else {
        state.order.misc.push(misc);
      }
    },
    [RESET_CART](state) {
      state.delivery = BASE_DELIVERIES[0].id;
      state.phone = "";
      state.order = Order.createNew();
    },
    [SET_CART_ORDER_ADDRESS_ENTITY](state, { entity, value }) {
      state.order.address[entity] = value;
    },
  },
  actions: {
    async fetchMisc({ commit }) {
      const data = await this.$api.misc.query();
      const misc = Misc.parseItems(data);
      commit(SET_CART_ENTITY, { entity: "misc", value: misc });
    },
  },
};
