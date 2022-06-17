import { createLocalVue, mount } from "@vue/test-utils";
import Vuex from "vuex";
import { generateMockStore } from "@/store/mocks";
import BuilderDoughSelector from "../components/BuilderDoughSelector";
import RadioButton from "@/common/components/RadioButton";
import { setDoughs } from "@/store/mocks/setters";

const localVue = createLocalVue();
localVue.use(Vuex);

describe("BuilderDoughSelector", () => {
  const stubs = {
    RadioButton,
  };
  let store;
  let wrapper;
  const createComponent = (options) => {
    wrapper = mount(BuilderDoughSelector, options);
  };

  beforeEach(() => {
    store = generateMockStore();
    setDoughs(store);
  });

  afterEach(() => {
    wrapper.destroy();
  });

  it("renders out dough content", () => {
    createComponent({ localVue, stubs, store });
    const doughItems = wrapper.findAll("input");
    expect(wrapper.exists()).toBe(true);
    expect(doughItems.length).toBe(store.state.Builder.doughs.length);
  });

  it("dough selector item contains dough name and description", () => {
    createComponent({ localVue, stubs, store });
    const { name, description } = store.state.Builder.doughs[0];
    const doughItems = wrapper.findAll("label");
    expect(doughItems.at(0).text()).toContain(name);
    expect(doughItems.at(0).text()).toContain(description);
  });

  it("dough is checked when its id is state pizza doughId", () => {
    createComponent({ localVue, stubs, store });
    const { doughId } = store.state.Builder.pizza;
    const checkedDough = wrapper.find(`[data-test-id='${doughId}']`);
    expect(checkedDough.element.checked).toBe(true);
  });

  it("changing active dough sets new state pizza doughId", async () => {
    createComponent({ localVue, stubs, store });
    const doughInput = wrapper.find("input:not(:checked)");
    expect(doughInput.element.checked).toBe(false);
    await doughInput.trigger("click");
    expect(doughInput.element.checked).toBe(true);
    const doughId = +doughInput.element.dataset.testId;
    expect(doughId).toBe(store.state.Builder.pizza.doughId);
  });

  it("calls the vuex mutation on dough selector change", async () => {
    createComponent({ localVue, stubs, store });
    const spyOnMutation = jest.spyOn(wrapper.vm, "setPizzaEntity");
    const uncheckedDough = wrapper.find("input:not(:checked)");
    await uncheckedDough.trigger("click");
    const doughId = +uncheckedDough.element.dataset.testId;
    expect(spyOnMutation).toHaveBeenCalledWith({
      entity: "doughId",
      value: doughId,
    });
  });
});
