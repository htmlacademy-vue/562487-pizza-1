import { createLocalVue, mount } from "@vue/test-utils";
import Vuex from "vuex";
import { generateMockStore } from "@/store/mocks";
import BuilderDoughSelector from "../components/BuilderDoughSelector";
import {
  testDoughs,
  testPizza,
  setDoughs,
  setPizza,
} from "@/store/mocks/setters";
import { setUIComponents } from "@/plugins/ui";

const localVue = createLocalVue();
localVue.use(Vuex);
setUIComponents(localVue);

describe("BuilderDoughSelector", () => {
  let store;
  let wrapper;
  const createComponent = (options) => {
    wrapper = mount(BuilderDoughSelector, options);
  };

  beforeEach(() => {
    store = generateMockStore();
    setDoughs(store);
    setPizza(store);
  });

  afterEach(() => {
    wrapper.destroy();
  });

  it("renders out dough content", () => {
    createComponent({ localVue, store });
    const doughItems = wrapper.findAll("input");
    expect(wrapper.exists()).toBe(true);
    expect(doughItems.length).toBe(testDoughs.length);
  });

  it("dough selector item contains dough name and description", () => {
    createComponent({ localVue, store });
    const { name, description } = testDoughs[0];
    const doughItems = wrapper.findAll("label");
    expect(doughItems.at(0).text()).toContain(name);
    expect(doughItems.at(0).text()).toContain(description);
  });

  it("dough is checked when its id is state pizza doughId", () => {
    createComponent({ localVue, store });
    const checkedDough = wrapper.find(`[data-test-id='${testPizza.doughId}']`);
    expect(checkedDough.element.checked).toBe(true);
  });

  it("changing active dough sets new state pizza doughId", async () => {
    createComponent({ localVue, store });
    const doughInput = wrapper.find("input:not(:checked)");
    expect(doughInput.element.checked).toBe(false);
    await doughInput.trigger("click");
    expect(doughInput.element.checked).toBe(true);
    const doughId = +doughInput.element.dataset.testId;
    expect(doughId).toBe(store.state.Builder.pizza.doughId);
  });

  it("calls the vuex mutation on dough selector change", async () => {
    createComponent({ localVue, store });
    const spyOnMutation = jest.spyOn(wrapper.vm, "setPizzaEntity");
    const doughInput = wrapper.find("input:not(:checked)");
    await doughInput.trigger("click");
    const doughId = +doughInput.element.dataset.testId;
    expect(spyOnMutation).toHaveBeenCalledWith({
      entity: "doughId",
      value: doughId,
    });
  });
});
