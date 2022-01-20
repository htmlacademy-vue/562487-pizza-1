import {
  SET_ENTITY,
  ADD_ENTITY,
  UPDATE_ENTITY,
  DELETE_ENTITY,
} from "@/store/mutations-types";
import { User, Address } from "@/common/models";

const namespace = {
  user: {
    module: "Auth",
    entity: "user",
  },
  addresses: {
    module: "Auth",
    entity: "addresses",
  },
};

export default {
  namespaced: true,
  state: {
    user: null,
    addresses: [],
  },
  actions: {
    async fetchUser({ commit, dispatch }) {
      try {
        const data = await this.$api.auth.fetchUser();
        const user = new User(data);
        commit(
          SET_ENTITY,
          {
            ...namespace.user,
            value: user,
          },
          { root: true }
        );
      } catch {
        dispatch("logout", false);
      }
    },
    async login({ dispatch }, credentials) {
      const data = await this.$api.auth.login(credentials);
      this.$jwt.saveToken(data.token);
      this.$api.auth.setAuthHeader();
      dispatch("fetchUser");
    },
    async logout({ commit }, sendRequest = true) {
      if (sendRequest) {
        await this.$api.auth.logout();
      }
      this.$jwt.destroyToken();
      this.$api.auth.setAuthHeader();
      commit(
        SET_ENTITY,
        {
          ...namespace.user,
          value: null,
        },
        { root: true }
      );
      commit(
        SET_ENTITY,
        {
          ...namespace.addresses,
          value: [],
        },
        { root: true }
      );
      commit(
        SET_ENTITY,
        {
          module: "Orders",
          entity: "orders",
          value: [],
        },
        { root: true }
      );
    },
    async queryAddresses({ commit }) {
      const data = await this.$api.addresses.query();
      const addresses = Address.parseItems(data);
      commit(
        SET_ENTITY,
        {
          ...namespace.addresses,
          value: addresses,
        },
        { root: true }
      );
    },
    async createAddress({ commit }, newAddress) {
      const data = await this.$api.addresses.post(newAddress);
      const { id } = data;
      commit(
        ADD_ENTITY,
        {
          ...namespace.addresses,
          value: { ...newAddress, id },
        },
        { root: true }
      );
    },
    async updateAddress({ commit }, address) {
      await this.$api.addresses.put(address);
      commit(
        UPDATE_ENTITY,
        {
          ...namespace.addresses,
          value: address,
        },
        { root: true }
      );
    },
    async deleteAddress({ commit }, id) {
      await this.$api.addresses.delete(id);
      commit(
        DELETE_ENTITY,
        {
          ...namespace.addresses,
          id,
        },
        { root: true }
      );
    },
  },
};
