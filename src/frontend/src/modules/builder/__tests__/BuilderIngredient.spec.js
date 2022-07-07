import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuex from "vuex";
import { nextTick } from "vue";
import { generateMockStore } from "@/store/mocks";
import BuilderIngredient from "../components/BuilderIngredient";
import { setIngredients, addIngredient } from "@/store/mocks/setters";
import { Ingredient } from "@/common/models";
import pizzaData from "@/static/pizza.json";
import { setUIComponents } from "@/plugins/ui";

const localVue = createLocalVue();
localVue.use(Vuex);
setUIComponents(localVue);

describe("BuilderIngredient", () => {
  const ingredient = new Ingredient(pizzaData.ingredients[0]);
  const propsData = { ingredient };

  let mutations;
  let store;
  let wrapper;
  const createComponent = (options) => {
    wrapper = shallowMount(BuilderIngredient, options);
  };

  const findSelectorItem = () =>
    wrapper.findComponent({ name: "SelectorItem" });
  const findItemCounter = () => wrapper.findComponent({ name: "ItemCounter" });

  beforeEach(() => {
    store = generateMockStore();
    setIngredients(store);
  });

  afterEach(() => {
    wrapper.destroy();
  });

  it("renders out builder ingredient", () => {
    createComponent({ localVue, store, propsData });
    expect(wrapper.exists()).toBe(true);
  });

  it("renders out selector item", () => {
    createComponent({ localVue, store, propsData });
    expect(findSelectorItem().exists()).toBe(true);
  });

  it("renders out item counter", () => {
    createComponent({ localVue, store, propsData });
    expect(findItemCounter().exists()).toBe(true);
  });

  it("adds filling className to selector item", () => {
    createComponent({ localVue, store, propsData });
    const fillingClasses = "filling--" + ingredient.value;
    expect(findSelectorItem().classes(fillingClasses)).toBe(true);
  });

  it("removes ingredient when item counter emits decrement click", async () => {
    addIngredient(store, {
      ingredientId: ingredient.ingredientId,
      quantity: 1,
    });
    createComponent({ localVue, store, propsData });
    expect(store.state.Builder.pizza.ingredients.length).toBe(1);
    findItemCounter().vm.$emit("decrementClick");
    await nextTick();
    expect(store.state.Builder.pizza.ingredients.length).toBe(0);
  });

  it("calls the vuex mutation when item counter emits decrement click", async () => {
    mutations = {
      Builder: {
        REMOVE_BUILDER_PIZZA_INGREDIENT: jest.fn(),
      },
    };
    store = generateMockStore({ mutations });
    setIngredients(store);
    addIngredient(store, {
      ingredientId: ingredient.ingredientId,
      quantity: 1,
    });
    createComponent({ localVue, store, propsData });
    findItemCounter().vm.$emit("decrementClick");
    await nextTick();
    expect(
      mutations.Builder.REMOVE_BUILDER_PIZZA_INGREDIENT
    ).toHaveBeenCalled();
  });

  it("adds ingredient when item counter emits increment click", async () => {
    createComponent({ localVue, store, propsData });
    expect(store.state.Builder.pizza.ingredients.length).toBe(0);
    findItemCounter().vm.$emit("incrementClick");
    await nextTick();
    expect(store.state.Builder.pizza.ingredients.length).toBe(1);
  });

  it("calls the vuex mutation when item counter emits increment click", async () => {
    mutations = {
      Builder: {
        ADD_BUILDER_PIZZA_INGREDIENT: jest.fn(),
      },
    };
    store = generateMockStore({ mutations });
    setIngredients(store);
    createComponent({ localVue, store, propsData });
    findItemCounter().vm.$emit("incrementClick");
    await nextTick();
    expect(mutations.Builder.ADD_BUILDER_PIZZA_INGREDIENT).toHaveBeenCalled();
  });
});
