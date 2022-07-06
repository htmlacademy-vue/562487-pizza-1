import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuex from "vuex";
import { generateMockStore } from "@/store/mocks";
import CartMisc from "../components/CartMisc";
import { setMisc } from "@/store/mocks/setters";

const localVue = createLocalVue();
localVue.use(Vuex);

describe("CartMisc", () => {
  let store;
  let wrapper;
  const createComponent = (options) => {
    wrapper = shallowMount(CartMisc, options);
  };

  const findItems = () => wrapper.findAllComponents({ name: "CartMiscItem" });

  beforeEach(() => {
    store = generateMockStore();
    setMisc(store);
  });

  afterEach(() => {
    wrapper.destroy();
  });

  it("renders out state misc", () => {
    createComponent({ localVue, store });
    expect(wrapper.exists()).toBe(true);
    expect(findItems().length).toBe(store.state.Cart.misc.length);
  });
});
