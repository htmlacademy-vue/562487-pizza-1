import { createLocalVue, mount } from "@vue/test-utils";
import Vuex from "vuex";
import { generateMockStore } from "@/store/mocks";
import BuilderPizzaView from "../components/BuilderPizzaView";
import { setUIComponents } from "@/plugins/ui";
import {
  setLoadData,
  setPizza,
  testPizza,
  testIngredients,
  addIngredient,
} from "@/store/mocks/setters";
import { findById } from "@/common/helpers";
const localVue = createLocalVue();
localVue.use(Vuex);
setUIComponents(localVue);

describe("BuilderPizzaView", () => {
  const firstIngredient = {
    ingredientId: 1,
    quantity: 1,
  };
  const secondIngredient = { ...firstIngredient, quantity: 2 };
  const thirdIngredient = { ...firstIngredient, quantity: 3 };
  let store;
  let wrapper;
  const createComponent = (options) => {
    wrapper = mount(BuilderPizzaView, options);
  };

  beforeEach(() => {
    store = generateMockStore();
    setLoadData(store);
    setPizza(store);
  });

  afterEach(() => {
    wrapper.destroy();
  });

  it("renders out pizza view", () => {
    createComponent({ localVue, store });
    expect(wrapper.exists()).toBe(true);
  });

  it("displays pizza foundation with classes", () => {
    createComponent({ localVue, store });
    const { doughId, sauceId } = testPizza;
    const { doughs, sauces } = store.state.Builder;
    const foundation = findById(doughs, doughId)?.foundation;
    const sauce = findById(sauces, sauceId)?.value;
    const foundationClasses = `pizza--foundation--${foundation}-${sauce}`;
    const pizzaView = wrapper.find("[data-test='pizza-view']");
    expect(pizzaView.classes(foundationClasses)).toBe(true);
  });

  it("renders out pizza fillings", () => {
    addIngredient(store, firstIngredient);
    addIngredient(store, secondIngredient);
    addIngredient(store, thirdIngredient);
    createComponent({ localVue, store });
    const fillingItems = wrapper.findAll("[data-test='filling-item']");
    const { ingredients } = store.state.Builder.pizza;
    expect(fillingItems.length).toBe(ingredients.length);
  });

  it("pizza filling has classes with ingredient value modifier", () => {
    addIngredient(store, firstIngredient);
    addIngredient(store, secondIngredient);
    addIngredient(store, thirdIngredient);
    createComponent({ localVue, store });
    const fillingItems = wrapper.findAll("[data-test='filling-item']");
    const { ingredients } = store.state.Builder.pizza;
    for (let i = 0; i < ingredients.length; i++) {
      let value = testIngredients.find(
        (it) => it.ingredientId === ingredients[i].ingredientId
      )?.value;
      expect(fillingItems.at(i).classes("pizza__filling--" + value)).toBe(true);
    }
  });

  it("pizza filling has classes with --second modifier when 2 ingredients", () => {
    addIngredient(store, firstIngredient);
    addIngredient(store, secondIngredient);
    createComponent({ localVue, store });
    const fillingItemSecond = wrapper.find("[data-quantity='2']");
    expect(fillingItemSecond.classes("pizza__filling--second")).toBe(true);
  });

  it("pizza filling has classes with --third modifier when 3 ingredients", () => {
    addIngredient(store, firstIngredient);
    addIngredient(store, secondIngredient);
    addIngredient(store, thirdIngredient);
    createComponent({ localVue, store });
    const fillingItemThird = wrapper.find("[data-quantity='3']");
    expect(fillingItemThird.classes("pizza__filling--third")).toBe(true);
  });
});
