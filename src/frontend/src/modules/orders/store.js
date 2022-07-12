import { SET_ENTITY, DELETE_ENTITY } from "@/store/mutations-types";
import { Order } from "@/common/models";
import { findById } from "@/common/helpers";

const namespace = { module: "Orders", entity: "orders" };

export default {
  namespaced: true,
  state: {
    orders: [],
  },
  getters: {
    getOrderById: (state) => (id) => findById(state.orders, id),
    totalPrice: (state, getters, rootState, rootGetters) => (order) => {
      const { orderPizzas, orderMisc } = order;
      const pizzasPrice = rootGetters["Builder/pizzasPrice"](orderPizzas);
      const miscPrice = rootGetters["Cart/miscPrice"](orderMisc);
      return pizzasPrice + miscPrice;
    },
  },
  actions: {
    async queryOrders({ commit }) {
      const data = await this.$api.orders.query();
      const orders = Order.parseItems(data);
      commit(
        SET_ENTITY,
        {
          ...namespace,
          value: orders,
        },
        { root: true }
      );
    },
    async createOrder(ctx, newOrder) {
      await this.$api.orders.post(newOrder);
    },
    async deleteOrder({ commit }, id) {
      await this.$api.orders.delete(id);
      commit(
        DELETE_ENTITY,
        {
          ...namespace,
          id,
        },
        { root: true }
      );
    },
  },
};
