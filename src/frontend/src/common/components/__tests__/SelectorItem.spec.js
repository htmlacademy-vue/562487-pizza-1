import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuex from "vuex";
import { generateMockStore } from "@/store/mocks";
import SelectorItem from "@/common/components/SelectorItem";
import AppDrag from "@/common/components/AppDrag";
import pizzaData from "@/static/pizza.json";
import { Ingredient } from "@/common/models";
import { addIngredient } from "@/store/mocks/setters";

const localVue = createLocalVue();
localVue.use(Vuex);

describe("SelectorItem", () => {
  const draggableClass = "item--draggable";
  const propsData = {
    ingredient: new Ingredient(pizzaData.ingredients[0]),
  };
  const stubs = { AppDrag };

  let store;
  let wrapper;
  const createComponent = (options) => {
    wrapper = shallowMount(SelectorItem, options);
  };

  const findAppDrag = () => wrapper.findComponent({ name: "AppDrag" });
  const findItem = () => wrapper.find("[data-test='selector-item']");

  beforeEach(() => {
    store = generateMockStore();
  });

  afterEach(() => {
    wrapper.destroy();
  });

  it("renders out prop ingredient name", () => {
    createComponent({ localVue, store, stubs, propsData });
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.html()).toContain(propsData.ingredient.name);
  });

  it("draggable ingredient has draggableClass", () => {
    createComponent({ localVue, store, stubs, propsData });
    expect(findAppDrag().props().isDraggable).toBe(true);
    expect(findItem().classes(draggableClass)).toBe(true);
  });

  it("undraggable ingredient has not draggableClass", () => {
    const ingredientId = propsData.ingredient.ingredientId;
    addIngredient(store, {
      ingredientId,
      quantity: 1,
    });
    addIngredient(store, {
      ingredientId,
      quantity: 2,
    });
    addIngredient(store, {
      ingredientId,
      quantity: 3,
    });
    createComponent({ localVue, store, stubs, propsData });
    expect(findAppDrag().props().isDraggable).toBe(false);
    expect(findItem().classes(draggableClass)).toBe(false);
  });
});
