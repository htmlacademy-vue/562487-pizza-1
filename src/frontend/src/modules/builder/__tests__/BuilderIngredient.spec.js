import { createLocalVue, mount } from "@vue/test-utils";
import Vuex from "vuex";
import { generateMockStore } from "@/store/mocks";
import BuilderIngredient from "../components/BuilderIngredient";
import ItemCounter from "@/common/components/ItemCounter";
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

  let store;
  let wrapper;
  const createComponent = (options) => {
    wrapper = mount(BuilderIngredient, options);
  };

  beforeEach(() => {
    store = generateMockStore();
    setIngredients(store);
  });

  afterEach(() => {
    wrapper.destroy();
  });

  it("renders out ingredients item content", () => {
    createComponent({ localVue, store, propsData });
    expect(wrapper.exists()).toBe(true);
  });

  it("renders out wrap with filling classes", () => {
    createComponent({ localVue, store, propsData });
    const fillingItem = wrapper.find(".filling");
    const fillingClasses = "filling--" + ingredient.value;
    expect(fillingItem.classes(fillingClasses)).toBe(true);
  });

  it("calls the vuex mutation when item counter emits decrement click", async () => {
    addIngredient(store, {
      ingredientId: ingredient.ingredientId,
      quantity: 1,
    });
    createComponent({ localVue, store, propsData });
    const spyOnMutation = jest.spyOn(wrapper.vm, "removePizzaIngredient");
    const itemCounter = wrapper.findComponent(ItemCounter);
    itemCounter.vm.$emit("decrementClick");
    expect(spyOnMutation).toHaveBeenCalledWith(ingredient);
  });

  it("calls the vuex mutation when item counter emits increment click", async () => {
    createComponent({ localVue, store, propsData });
    const spyOnMutation = jest.spyOn(wrapper.vm, "addPizzaIngredient");
    const itemCounter = wrapper.findComponent(ItemCounter);
    itemCounter.vm.$emit("incrementClick");
    expect(spyOnMutation).toHaveBeenCalledWith({
      ingredientId: ingredient.ingredientId,
      quantity: 1,
    });
  });
});
