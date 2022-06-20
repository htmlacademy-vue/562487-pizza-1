import { createLocalVue, mount } from "@vue/test-utils";
import Vuex from "vuex";
import { generateMockStore } from "@/store/mocks";
import BuilderSizeSelector from "../components/BuilderSizeSelector";
import { setSizes } from "@/store/mocks/setters";
import { setUIComponents } from "@/plugins/ui";

const localVue = createLocalVue();
localVue.use(Vuex);
setUIComponents(localVue);

describe("BuilderSizeSelector", () => {
  let store;
  let wrapper;
  const createComponent = (options) => {
    wrapper = mount(BuilderSizeSelector, options);
  };

  beforeEach(() => {
    store = generateMockStore();
    setSizes(store);
  });

  afterEach(() => {
    wrapper.destroy();
  });

  it("renders out sizes content", () => {
    createComponent({ localVue, store });
    const items = wrapper.findAll("input");
    expect(wrapper.exists()).toBe(true);
    expect(items.length).toBe(store.state.Builder.sizes.length);
  });

  it("size selector item contains size name", () => {
    createComponent({ localVue, store });
    const { name } = store.state.Builder.sizes[0];
    const items = wrapper.findAll("label");
    expect(items.at(0).text()).toContain(name);
  });

  it("size is checked when its id is state pizza sizeId", () => {
    createComponent({ localVue, store });
    const { sizeId } = store.state.Builder.pizza;
    const checkedSize = wrapper.find(`[data-test-id='${sizeId}']`);
    expect(checkedSize.element.checked).toBe(true);
  });

  it("changing active size sets new state pizza sizeId", async () => {
    createComponent({ localVue, store });
    const sizeInput = wrapper.find("input:not(:checked)");
    expect(sizeInput.element.checked).toBe(false);
    await sizeInput.trigger("click");
    expect(sizeInput.element.checked).toBe(true);
    const sizeId = +sizeInput.element.dataset.testId;
    expect(sizeId).toBe(store.state.Builder.pizza.sizeId);
  });

  it("calls the vuex mutation on size selector change", async () => {
    createComponent({ localVue, store });
    const spyOnMutation = jest.spyOn(wrapper.vm, "setPizzaEntity");
    const sizeInput = wrapper.find("input:not(:checked)");
    await sizeInput.trigger("click");
    const sizeId = +sizeInput.element.dataset.testId;
    expect(spyOnMutation).toHaveBeenCalledWith({
      entity: "sizeId",
      value: sizeId,
    });
  });
});
