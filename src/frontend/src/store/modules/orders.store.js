import { SET_ENTITY, ADD_ENTITY, DELETE_ENTITY } from "@/store/mutations-types";
import { Order } from "@/common/models";

const namespace = { module: "Orders", entity: "orders" };

export default {
  namespaced: true,
  state: {
    orders: [],
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
    async createOrder({ commit }, newOrder) {
      const data = await this.$api.orders.post(newOrder);
      const { id } = data;
      commit(
        ADD_ENTITY,
        {
          ...namespace,
          value: { ...newOrder, id },
        },
        { root: true }
      );
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
