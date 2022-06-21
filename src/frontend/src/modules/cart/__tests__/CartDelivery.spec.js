import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuex from "vuex";
import { generateMockStore } from "@/store/mocks";
import CartDelivery from "../components/CartDelivery";
import CartFormAddress from "../components/CartFormAddress";
import { setUIComponents } from "@/plugins/ui";
import { setDelivery } from "@/store/mocks/setters";
import { BASE_DELIVERIES } from "@/common/constants";

const localVue = createLocalVue();
localVue.use(Vuex);
setUIComponents(localVue);

describe("CartDelivery", () => {
  let store;
  let wrapper;
  const createComponent = (options) => {
    wrapper = shallowMount(CartDelivery, options);
  };

  beforeEach(() => {
    store = generateMockStore();
  });

  afterEach(() => {
    wrapper.destroy();
  });

  it("renders out cart delivery", () => {
    createComponent({ localVue, store });
    expect(wrapper.exists()).toBe(true);
  });

  it("renders out cart delivery without address fields", () => {
    setDelivery(store, BASE_DELIVERIES[0].id);
    createComponent({ localVue, store });
    const address = wrapper.findComponent(CartFormAddress);
    expect(address.exists()).toBe(false);
  });

  it("renders out cart delivery with address fields", () => {
    setDelivery(store, BASE_DELIVERIES[1].id);
    createComponent({ localVue, store });
    const address = wrapper.findComponent(CartFormAddress);
    expect(address.exists()).toBe(true);
  });
});
