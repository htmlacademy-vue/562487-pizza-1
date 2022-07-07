import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuex from "vuex";
import { generateMockStore } from "@/store/mocks";
import BuilderPizzaResult from "../components/BuilderPizzaResult";
import {
  setPizza,
  setLoadData,
  testPizza,
  setPizzaName,
  setPizzaIngredients,
} from "@/store/mocks/setters";
import { setUIComponents } from "@/plugins/ui";

const localVue = createLocalVue();
localVue.use(Vuex);
setUIComponents(localVue);

describe("BuilderPizzaResult", () => {
  let store;
  let wrapper;
  const createComponent = (options) => {
    wrapper = shallowMount(BuilderPizzaResult, options);
  };

  const findPizzaPrice = () => wrapper.find("[data-test='pizza-price']");
  const findSubmit = () => wrapper.find("[type='submit']");

  beforeEach(() => {
    store = generateMockStore();
    setLoadData(store);
    setPizza(store);
  });

  afterEach(() => {
    wrapper.destroy();
  });

  it("renders out pizza price", () => {
    createComponent({ localVue, store });
    expect(findPizzaPrice().exists()).toBe(true);
  });

  it("pizza price displays state builder pizza price", () => {
    createComponent({ localVue, store });
    const pizzaPriceValue = store.getters["Builder/pizzaPrice"](testPizza);
    expect(findPizzaPrice().text()).toBe(`Итого: ${pizzaPriceValue} ₽`);
  });

  it("renders out submit button", () => {
    createComponent({ localVue, store });
    expect(findSubmit().exists()).toBe(true);
  });

  it("renders out submit button disabled when empty pizza name", () => {
    setPizzaName(store, "");
    createComponent({ localVue, store });
    expect(findSubmit().attributes().disabled).toBeTruthy();
  });

  it("renders out submit button disabled when empty pizza ingredients", () => {
    setPizzaIngredients(store, []);
    createComponent({ localVue, store });
    expect(findSubmit().attributes().disabled).toBeTruthy();
  });

  it("renders out submit button not disabled", () => {
    createComponent({ localVue, store });
    expect(findSubmit().attributes().disabled).toBeFalsy();
  });
});
