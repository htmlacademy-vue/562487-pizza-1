import { createLocalVue, mount } from "@vue/test-utils";
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
  const appDragSelector = "[data-test='app-drag']";
  const itemSelector = "[data-test='selector-item']";
  const draggableClass = "item--draggable";
  const propsData = {
    ingredient: new Ingredient(pizzaData.ingredients[0]),
  };
  const stubs = { AppDrag };

  let store;
  let wrapper;
  const createComponent = (options) => {
    wrapper = mount(SelectorItem, options);
  };

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
    const itemEl = wrapper.find(itemSelector);
    const appDragEl = wrapper.find(appDragSelector);
    expect(appDragEl.element.draggable).toBe(true);
    expect(itemEl.classes(draggableClass)).toBe(true);
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
    const appDragEl = wrapper.find(appDragSelector);
    const itemEl = wrapper.find(itemSelector);
    expect(appDragEl.element.draggable).toBe(false);
    expect(itemEl.classes(draggableClass)).toBe(false);
  });
});
