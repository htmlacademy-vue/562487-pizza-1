import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuex from "vuex";
import { generateMockStore } from "@/store/mocks";
import CartDelivery from "../components/CartDelivery";
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

  const findFormSelect = () => wrapper.findComponent({ name: "CartFormSelect" });
  const findFormPhone = () => wrapper.findComponent({ name: "CartFormPhone" });
  const findFormAddress = () =>
    wrapper.findComponent({ name: "CartFormAddress" });

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

  it("renders out form select", () => {
    createComponent({ localVue, store });
    expect(findFormSelect().exists()).toBe(true);
  });

  it("renders out form phone", () => {
    createComponent({ localVue, store });
    expect(findFormPhone().exists()).toBe(true);
  });

  it("does not renders out form address", () => {
    setDelivery(store, BASE_DELIVERIES[0].id);
    createComponent({ localVue, store });
    expect(findFormAddress().exists()).toBe(false);
  });

  it("renders out form address", () => {
    setDelivery(store, BASE_DELIVERIES[1].id);
    createComponent({ localVue, store });
    expect(findFormAddress().exists()).toBe(true);
  });
});
