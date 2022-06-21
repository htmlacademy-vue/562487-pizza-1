import { createLocalVue, mount } from "@vue/test-utils";
import Vuex from "vuex";
import { generateMockStore } from "@/store/mocks";
import CartFooter from "../components/CartFooter";
import { setUIComponents } from "@/plugins/ui";
import {
  setDoughs,
  setSauces,
  setSizes,
  setIngredients,
  setMisc,
  setCartPizzas,
  setOrderMisc,
  testPizza,
} from "@/store/mocks/setters";

const localVue = createLocalVue();
localVue.use(Vuex);
setUIComponents(localVue);

describe("CartFooter", () => {
  const propsData = {
    isSubmitDisabled: true,
  };
  const stubs = ["router-link"];
  let store;
  let wrapper;
  const createComponent = (options) => {
    wrapper = mount(CartFooter, options);
  };

  beforeEach(() => {
    store = generateMockStore();
    setDoughs(store);
    setSauces(store);
    setSizes(store);
    setIngredients(store);
    setMisc(store);
  });

  afterEach(() => {
    wrapper.destroy();
  });

  it("renders out cart footer", () => {
    createComponent({ localVue, store, stubs, propsData });
    expect(wrapper.exists()).toBe(true);
  });

  it("renders out router link to root route", () => {
    createComponent({ localVue, store, stubs, propsData });
    const routerLink = wrapper.find("[data-test='one-more-btn']");
    expect(routerLink.attributes().to).toBe("/");
  });

  it("renders out empty cart total price", () => {
    createComponent({ localVue, store, stubs, propsData });
    const footerPrice = wrapper.find("[data-test='footer-price']");
    expect(footerPrice.text()).toBe("Итого: 0 ₽");
  });

  it("renders out cart total price", () => {
    const testMisc = {
      miscId: 1,
      quantity: 1,
    };
    setOrderMisc(store, [testMisc]); // 56
    setCartPizzas(store, [testPizza]); // 700
    createComponent({
      localVue,
      store,
      stubs,
      propsData: {
        isSubmitDisabled: false,
      },
    });
    const footerPrice = wrapper.find("[data-test='footer-price']");
    expect(footerPrice.text()).toBe("Итого: 756 ₽");
  });

  it("renders out submit button disabled when prop isSubmitDisabled", () => {
    createComponent({ localVue, store, stubs, propsData });
    const submitBtn = wrapper.find("[type=submit]");
    expect(submitBtn.element.disabled).toBe(true);
  });

  it("renders out submit button not disabled", () => {
    createComponent({
      localVue,
      store,
      stubs,
      propsData: {
        isSubmitDisabled: false,
      },
    });
    const submitBtn = wrapper.find("[type=submit]");
    expect(submitBtn.element.disabled).toBe(false);
  });
});
