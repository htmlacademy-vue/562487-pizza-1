import { createLocalVue, mount } from "@vue/test-utils";
import Vuex from "vuex";
import { generateMockStore } from "@/store/mocks";
import BuilderPizzaResult from "../components/BuilderPizzaResult";
import {
  addIngredient,
  setPizza,
  setLoadData,
  testPizza,
} from "@/store/mocks/setters";
import { setUIComponents } from "@/plugins/ui";

const localVue = createLocalVue();
localVue.use(Vuex);
setUIComponents(localVue);

describe("BuilderPizzaResult", () => {
  const ingredient = { ingredientId: 1, quantity: 1 };
  let store;
  let wrapper;
  const createComponent = (options) => {
    wrapper = mount(BuilderPizzaResult, options);
  };

  beforeEach(() => {
    store = generateMockStore();
    setLoadData(store);
    setPizza(store);
  });

  afterEach(() => {
    wrapper.destroy();
  });

  it("renders out state pizza price", () => {
    createComponent({ localVue, store });
    const priceItem = wrapper.find("[data-test='pizza-price']");
    const pizzaPriceValue = store.getters["Builder/pizzaPrice"](testPizza);
    expect(priceItem.exists()).toBe(true);
    expect(priceItem.text()).toContain(pizzaPriceValue);
  });

  it("renders out submit button disabled", () => {
    createComponent({ localVue, store });
    const btn = wrapper.find("[type='submit']");
    expect(btn.exists()).toBe(true);
    expect(btn.element.disabled).toBe(true);
  });

  it("renders out submit button not disabled", () => {
    addIngredient(store, ingredient);
    createComponent({ localVue, store });
    const btn = wrapper.find("[type='submit']");
    expect(btn.exists()).toBe(true);
    expect(btn.element.disabled).toBe(false);
  });
});
