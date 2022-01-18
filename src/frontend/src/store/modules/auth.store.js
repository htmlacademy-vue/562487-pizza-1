import userJson from "@/static/user.json";
import { SET_ENTITY } from "@/store/mutations-types";
import { User, Address } from "@/common/models";

const mockAddresses = [
  {
    id: 1,
    name: "Дом",
    street: "Невский пр.",
    building: "22",
    flat: "46",
    comment: "Позвоните, пожалуйста, от проходной",
    userId: "uuid",
  },
];

export default {
  namespaced: true,
  state: {
    user: null,
    addresses: [],
  },
  actions: {
    fetchUser({ commit }) {
      const user = new User(userJson);
      commit(
        SET_ENTITY,
        {
          module: "Auth",
          entity: "user",
          value: user,
        },
        { root: true }
      );
    },
    login({ commit }, loginData) {
      const user = new User({ ...userJson, email: loginData.email });

      commit(
        SET_ENTITY,
        {
          module: "Auth",
          entity: "user",
          value: user,
        },
        { root: true }
      );
    },
    logout({ commit }) {
      commit(
        SET_ENTITY,
        {
          module: "Auth",
          entity: "user",
          value: null,
        },
        { root: true }
      );
      commit(
        SET_ENTITY,
        {
          module: "Auth",
          entity: "addresses",
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
    queryAddresses({ commit }) {
      const addresses = Address.parseItems(mockAddresses);
      commit(
        SET_ENTITY,
        {
          module: "Auth",
          entity: "addresses",
          value: addresses,
        },
        { root: true }
      );
    },
  },
};
