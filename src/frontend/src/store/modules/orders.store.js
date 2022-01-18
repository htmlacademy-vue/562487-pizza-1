import { uniqueId } from "lodash";
import { SET_ENTITY, ADD_ENTITY, DELETE_ORDER } from "@/store/mutations-types";

const namespace = { module: "Orders", entity: "orders" };

export default {
  namespaced: true,
  state: {
    orders: [],
  },
  mutations: {
    [DELETE_ORDER](state, id) {
      const index = state.orders.findIndex((it) => it.id === id);
      if (~index) {
        state.orders.splice(index, 1);
      }
    },
  },
  actions: {
    queryOrders({ commit }) {
      commit(
        SET_ENTITY,
        {
          ...namespace,
          value: [],
        },
        { root: true }
      );
    },
    createOrder({ commit }, newOrder) {
      const id = uniqueId("order_");
      commit(
        ADD_ENTITY,
        {
          ...namespace,
          value: { ...newOrder, id },
        },
        { root: true }
      );
    },
    deleteOrder({ commit }, id) {
      commit(DELETE_ORDER, id);
    },
  },
};
