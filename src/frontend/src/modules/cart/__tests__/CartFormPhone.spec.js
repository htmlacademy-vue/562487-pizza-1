import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuex from "vuex";
import { nextTick } from "vue";
import { generateMockStore } from "@/store/mocks";
import CartFormPhone from "../components/CartFormPhone";
import { setUIComponents } from "@/plugins/ui";
import { setPhone } from "@/store/mocks/setters";

const localVue = createLocalVue();
localVue.use(Vuex);
setUIComponents(localVue);

describe("CartFormPhone", () => {
  const cartPhone = "88000000000";

  let mutations;
  let store;
  let wrapper;
  const createComponent = (options) => {
    wrapper = shallowMount(CartFormPhone, options);
  };

  const findInput = () => wrapper.findComponent({ name: "AppInput" });

  beforeEach(() => {
    store = generateMockStore();
    setPhone(store, cartPhone);
  });

  afterEach(() => {
    wrapper.destroy();
  });

  it("renders out phone input", () => {
    createComponent({ localVue, store });
    expect(wrapper.exists()).toBe(true);
  });

  it("phone input value is cart state phone", () => {
    createComponent({ localVue, store });
    expect(findInput().props().value).toBe(cartPhone);
  });

  it("changes state phone when phone input emits input", async () => {
    const newPhone = "88002000600";
    createComponent({ localVue, store });
    findInput().vm.$emit("input", newPhone);
    await nextTick();
    expect(store.state.Cart.phone).toBe(newPhone);
  });

  it("call vuex mutation when phone input emits input", async () => {
    const newPhone = "88002000600";
    mutations = {
      Cart: {
        SET_CART_ENTITY: jest.fn(),
      },
    };
    store = generateMockStore({ mutations });
    setPhone(store, "");
    createComponent({ localVue, store });
    findInput().vm.$emit("input", newPhone);
    await nextTick();
    expect(mutations.Cart.SET_CART_ENTITY).toHaveBeenCalled();
  });
});
