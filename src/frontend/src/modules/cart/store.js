import {
  SET_CART_ENTITY,
  SET_CART_ORDER_ADDRESS_ENTITY,
  ADD_PIZZA,
  UPDATE_PIZZA,
  DELETE_PIZZA,
  UPDATE_PIZZA_QUANTITY,
  UPDATE_CART_ORDER_MISC,
  RESET_CART,
  SET_CART_WITH_ORDER,
} from "@/store/mutations-types";
import { Misc, Pizza } from "@/common/models";
import { findById, sum } from "@/common/helpers";
import { BASE_DELIVERIES } from "@/common/constants";

export default {
  namespaced: true,
  state: {
    misc: [],
    delivery: BASE_DELIVERIES[0].id,
    phone: "",
    orderPizzas: [],
    orderMisc: [],
    orderAddress: null,
  },
  getters: {
    miscById: (state) => (id) => state.misc.find((it) => it.miscId === id),
    orderMiscById: (state) => (id) =>
      state.orderMisc.find((it) => it.miscId === id),
    miscPriceById: (state, getters) => (id) => getters.miscById(id).price,
    orderMiscQuantityById: (state, getters) => (id) => {
      const miscItem = getters.orderMiscById(id);
      if (!miscItem) {
        return 0;
      }
      return miscItem.quantity;
    },
    orderPizzaById: (state) => (id) => findById(state.orderPizzas, id),
    orderPizzaNameById: (state, getters) => (id) =>
      getters.orderPizzaById(id).name,
    cartPizzasPrice: (state, getters, rootState, rootGetters) =>
      rootGetters["Builder/pizzasPrice"](state.orderPizzas),
    miscPrice: (state, getters) => (miscItems) =>
      miscItems
        .map(({ miscId, quantity }) => getters.miscPriceById(miscId) * quantity)
        .reduce(sum, 0),
    cartMiscPrice: (state, getters) => getters.miscPrice(state.orderMisc),
    totalSum: (state, getters) => {
      return getters.cartPizzasPrice + getters.cartMiscPrice;
    },
    isEmpty: (state) => state.orderPizzas.length === 0,
  },
  mutations: {
    [SET_CART_ENTITY](state, { entity, value }) {
      state[entity] = value;
    },
    [ADD_PIZZA](state, pizza) {
      const newPizza = new Pizza(pizza);
      state.orderPizzas.push(newPizza);
    },
    [UPDATE_PIZZA](state, pizza) {
      const index = state.orderPizzas.findIndex((it) => it.id === pizza.id);
      if (~index) {
        state.orderPizzas.splice(index, 1, pizza);
      }
    },
    [DELETE_PIZZA](state, id) {
      const index = state.orderPizzas.findIndex((it) => it.id === id);
      if (~index) {
        state.orderPizzas.splice(index, 1);
      }
    },
    [UPDATE_PIZZA_QUANTITY](state, { id, quantity }) {
      const index = state.orderPizzas.findIndex((it) => it.id === id);
      if (~index) {
        state.orderPizzas[index].quantity = quantity;
      }
    },
    [UPDATE_CART_ORDER_MISC](state, miscItem) {
      const { miscId, quantity } = miscItem;
      const index = state.orderMisc.findIndex((it) => it.miscId === miscId);
      if (~index) {
        if (!quantity) {
          state.orderMisc.splice(index, 1);
        } else {
          state.orderMisc.splice(index, 1, miscItem);
        }
        return;
      }
      state.orderMisc.push(miscItem);
    },
    [RESET_CART](state) {
      state.delivery = BASE_DELIVERIES[0].id;
      state.phone = "";
      state.orderPizzas = [];
      state.orderMisc = [];
      state.orderAddress = null;
    },
    [SET_CART_ORDER_ADDRESS_ENTITY](state, { entity, value }) {
      state.orderAddress[entity] = value;
    },
    [SET_CART_WITH_ORDER](state, order) {
      state.delivery = order.orderAddress?.id || BASE_DELIVERIES[0].id;
      state.phone = order.phone;
      state.orderAddress = order.orderAddress;
      state.orderPizzas = Pizza.parseItems(order.orderPizzas);
      state.orderMisc = order.orderMisc;
    },
  },
  actions: {
    async fetchMisc({ commit }) {
      const data = await this.$api.misc.query();
      const misc = Misc.parseItems(data);
      commit(SET_CART_ENTITY, { entity: "misc", value: misc });
    },
    deletePizza({ commit, state }, id) {
      commit(DELETE_PIZZA, id);
      if (!state.orderPizzas.length) {
        commit(RESET_CART);
      }
    },
    setDelivery({ commit, rootGetters }, data) {
      const delivery = data.delivery;
      const address = data?.address;
      commit(SET_CART_ENTITY, { entity: "delivery", value: delivery });
      if (delivery === BASE_DELIVERIES[0].id) {
        commit(SET_CART_ENTITY, { entity: "orderAddress", value: null });
      } else if (delivery === BASE_DELIVERIES[1].id) {
        if (!address) {
          commit(SET_CART_ENTITY, {
            entity: "orderAddress",
            value: {
              street: "",
              building: "",
              flat: "",
            },
          });
          return;
        }
        commit(SET_CART_ENTITY, {
          entity: "orderAddress",
          value: {
            street: address.street,
            building: address.building,
            flat: address.flat,
          },
        });
      } else {
        const userAddress = rootGetters["Auth/addressById"](+delivery);
        if (userAddress) {
          commit(SET_CART_ENTITY, {
            entity: "orderAddress",
            value: userAddress,
          });
        }
      }
    },
  },
};
