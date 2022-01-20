import { uniqueId } from "lodash";
import {
  SET_ENTITY,
  ADD_PIZZA,
  UPDATE_PIZZA,
  DELETE_PIZZA,
  UPDATE_CART_ORDER_MISC,
  RESET_CART,
  SET_CART_ENTITY,
  RESET_ADDRESS,
} from "@/store/mutations-types";
import { Misc } from "@/common/models";
import { Deliveries } from "@/common/enums";
import { calculateSum, findById } from "@/common/helpers";

const MODULE = "Cart";

const createNewAddress = () => ({
  street: "",
  building: "",
  flat: "",
  comment: "",
});

export default {
  namespaced: true,
  state: {
    pizzas: [],
    misc: [],
    orderMisc: [],
    delivery: Deliveries[1],
    phone: "",
    address: null,
  },
  getters: {
    miscById: (state) => (id) => findById(state.misc, id),
    miscQuantityById: (state) => (id) =>
      state.orderMisc.find((it) => it.miscId === id)?.quantity || 0,
    pizzasPrice: (state) => calculateSum(state.pizzas),
    miscPrice: (state) =>
      state.orderMisc
        .map(({ miscId, quantity }) => {
          const miscItem = findById(state.misc, miscId);
          return miscItem.price * quantity;
        })
        .reduce((acc, it) => acc + it, 0),
    totalSum: (state, getters) => getters.pizzasPrice + getters.miscPrice,
    isEmpty: (state) => state.pizzas.length === 0,
  },
  mutations: {
    [ADD_PIZZA](state, newPizza) {
      const id = uniqueId("pizza_");
      state.pizzas.push({ ...newPizza, id });
    },
    [UPDATE_PIZZA](state, pizza) {
      const index = state.pizzas.findIndex((it) => it.id === pizza.id);
      if (~index) {
        state.pizzas.splice(index, 1, pizza);
      }
    },
    [DELETE_PIZZA](state, id) {
      const index = state.pizzas.findIndex((it) => it.id === id);
      if (~index) {
        state.pizzas.splice(index, 1);
      }
    },
    [UPDATE_CART_ORDER_MISC](state, misc) {
      const index = state.orderMisc.findIndex(
        (it) => it.miscId === misc.miscId
      );
      if (~index) {
        if (!misc.quantity) {
          state.orderMisc.splice(index, 1);
        } else {
          state.orderMisc.splice(index, 1, misc);
        }
      } else {
        state.orderMisc.push(misc);
      }
    },
    [RESET_CART](state) {
      state.pizzas = [];
      state.orderMisc = [];
      state.delivery = Deliveries[1];
      state.phone = "";
      state.address = null;
    },
    [SET_CART_ENTITY](state, { name, value }) {
      state[name] = value;
    },
    [RESET_ADDRESS](state) {
      state.address = createNewAddress();
    },
  },
  actions: {
    async fetchMisc({ commit }) {
      const data = await this.$api.misc.query();
      const misc = Misc.parseItems(data);
      commit(
        SET_ENTITY,
        {
          module: MODULE,
          entity: "misc",
          value: misc,
        },
        { root: true }
      );
    },
  },
};
