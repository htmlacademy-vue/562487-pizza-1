import { createLocalVue, mount } from "@vue/test-utils";
import Vuex from "vuex";
import { generateMockStore } from "@/store/mocks";
import BuilderIngredientsSelector from "../components/BuilderIngredientsSelector";
import {
  setSauces,
  setIngredients,
  testSauces,
  testIngredients,
} from "@/store/mocks/setters";
import { setUIComponents } from "@/plugins/ui";

const localVue = createLocalVue();
localVue.use(Vuex);
setUIComponents(localVue);

describe("BuilderIngredientsSelector", () => {
  let store;
  let wrapper;
  const createComponent = (options) => {
    wrapper = mount(BuilderIngredientsSelector, options);
  };

  beforeEach(() => {
    store = generateMockStore();
    setSauces(store);
    setIngredients(store);
  });

  afterEach(() => {
    wrapper.destroy();
  });

  it("renders out content", () => {
    createComponent({ localVue, store });
    expect(wrapper.exists()).toBe(true);
  });

  it("renders out sauces", () => {
    createComponent({ localVue, store });
    const sauceItems = wrapper.findAll("[data-test='sauce']");
    expect(sauceItems.length).toBe(testSauces.length);
  });

  it("renders out ingredients", () => {
    createComponent({ localVue, store });
    const ingredientItems = wrapper.findAll("[data-test='ingredient']");
    expect(ingredientItems.length).toBe(testIngredients.length);
  });

  it("calls the vuex mutation on sauce selector change", async () => {
    createComponent({ localVue, store });
    const spyOnMutation = jest.spyOn(wrapper.vm, "setPizzaEntity");
    const sauceInput = wrapper.find("[data-test='sauce'] input:not(:checked)");
    await sauceInput.trigger("click");
    const sauceId = +sauceInput.element.dataset.testId;
    expect(spyOnMutation).toHaveBeenCalledWith({
      entity: "sauceId",
      value: sauceId,
    });
  });
});
