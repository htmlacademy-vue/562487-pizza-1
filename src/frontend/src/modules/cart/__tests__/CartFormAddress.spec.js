import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuex from "vuex";
import { nextTick } from "vue";
import { generateMockStore } from "@/store/mocks";
import CartFormAddress from "../components/CartFormAddress";
import { setUIComponents } from "@/plugins/ui";
import {
  setCartAddress,
  setUserAddresses,
  testAddress,
} from "@/store/mocks/setters";

const localVue = createLocalVue();
localVue.use(Vuex);
setUIComponents(localVue);

describe("CartFormAddress", () => {
  const cartAddress = {
    street: "Baker street",
    building: "1",
    flat: "1",
  };

  let mutations;
  let store;
  let wrapper;
  const createComponent = (options) => {
    wrapper = shallowMount(CartFormAddress, options);
  };

  const findInputs = () => wrapper.findAllComponents({ name: "AppInput" });
  const findStreetInput = () => wrapper.find("[data-test='input-street']");
  const findBuildingInput = () => wrapper.find("[data-test='input-building']");
  const findFlatInput = () => wrapper.find("[data-test='input-flat']");

  beforeEach(() => {
    store = generateMockStore();
    setCartAddress(store, cartAddress);
  });

  afterEach(() => {
    wrapper.destroy();
  });

  describe("cart address form", () => {
    it("renders out cart address form", () => {
      createComponent({ localVue, store });
      expect(wrapper.exists()).toBe(true);
    });

    it("inputs are readonly when state orderAddress is user address", () => {
      setUserAddresses(store);
      setCartAddress(store, testAddress);
      createComponent({ localVue, store });
      const inputs = findInputs();
      for (let i = 0; i < inputs.length; i++) {
        expect(inputs.at(i).props().readonly).toBe(true);
      }
    });
  });

  describe("street input", () => {
    it("renders out street input", () => {
      createComponent({ localVue, store });
      expect(findStreetInput().exists()).toBe(true);
    });

    it("street input value is cart state orderAddress street", () => {
      createComponent({ localVue, store });
      expect(findStreetInput().props().value).toBe(
        store.state.Cart.orderAddress.street
      );
    });

    it("changes state order address street when street input emits input", async () => {
      const newValue = "Baker Street";
      createComponent({ localVue, store });
      findStreetInput().vm.$emit("input", newValue);
      await nextTick();
      expect(store.state.Cart.orderAddress.street).toBe(newValue);
    });

    it("call vuex mutation when street input emits input", async () => {
      const newValue = "Baker Street";
      mutations = {
        Cart: {
          SET_CART_ORDER_ADDRESS_ENTITY: jest.fn(),
        },
      };
      store = generateMockStore({ mutations });
      setCartAddress(store, cartAddress);
      createComponent({ localVue, store });
      findStreetInput().vm.$emit("input", newValue);
      await nextTick();
      expect(mutations.Cart.SET_CART_ORDER_ADDRESS_ENTITY).toHaveBeenCalled();
    });
  });

  describe("building input", () => {
    it("renders out building input", () => {
      createComponent({ localVue, store });
      expect(findBuildingInput().exists()).toBe(true);
    });

    it("building input value is cart state orderAddress building", () => {
      createComponent({ localVue, store });
      expect(findBuildingInput().props().value).toBe(
        store.state.Cart.orderAddress.building
      );
    });

    it("changes state order address building when building input emits input", async () => {
      const newValue = "2";
      createComponent({ localVue, store });
      findBuildingInput().vm.$emit("input", newValue);
      await nextTick();
      expect(store.state.Cart.orderAddress.building).toBe(newValue);
    });

    it("call vuex mutation when building input emits input", async () => {
      const newValue = "2";
      mutations = {
        Cart: {
          SET_CART_ORDER_ADDRESS_ENTITY: jest.fn(),
        },
      };
      store = generateMockStore({ mutations });
      setCartAddress(store, cartAddress);
      createComponent({ localVue, store });
      findBuildingInput().vm.$emit("input", newValue);
      await nextTick();
      expect(mutations.Cart.SET_CART_ORDER_ADDRESS_ENTITY).toHaveBeenCalled();
    });
  });

  describe("flat input", () => {
    it("renders out flat input", () => {
      createComponent({ localVue, store });
      expect(findFlatInput().exists()).toBe(true);
    });

    it("flat input value is cart state orderAddress flat", () => {
      createComponent({ localVue, store });
      expect(findFlatInput().props().value).toBe(
        store.state.Cart.orderAddress.flat
      );
    });

    it("changes state order address flat when flat input emits input", async () => {
      const newValue = "2";
      createComponent({ localVue, store });
      findFlatInput().vm.$emit("input", newValue);
      await nextTick();
      expect(store.state.Cart.orderAddress.flat).toBe(newValue);
    });

    it("call vuex mutation when flat input emits input", async () => {
      const newValue = "2";
      mutations = {
        Cart: {
          SET_CART_ORDER_ADDRESS_ENTITY: jest.fn(),
        },
      };
      store = generateMockStore({ mutations });
      setCartAddress(store, cartAddress);
      createComponent({ localVue, store });
      findFlatInput().vm.$emit("input", newValue);
      await nextTick();
      expect(mutations.Cart.SET_CART_ORDER_ADDRESS_ENTITY).toHaveBeenCalled();
    });
  });
});
