import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuex from "vuex";
import { nextTick } from "vue";
import { generateMockStore } from "@/store/mocks";
import BuilderSizeSelector from "../components/BuilderSizeSelector";
import { setSizes } from "@/store/mocks/setters";
import { setUIComponents } from "@/plugins/ui";
import { findCheckedItem, findNotCheckedItem } from "@/common/helpers";

const localVue = createLocalVue();
localVue.use(Vuex);
setUIComponents(localVue);

describe("BuilderSizeSelector", () => {
  let mutations;
  let store;
  let wrapper;
  const createComponent = (options) => {
    wrapper = shallowMount(BuilderSizeSelector, options);
  };

  const findInputs = () => wrapper.findAllComponents({ name: "RadioButton" });

  beforeEach(() => {
    store = generateMockStore();
    setSizes(store);
  });

  afterEach(() => {
    wrapper.destroy();
  });

  it("renders out sizes content", () => {
    createComponent({ localVue, store });
    expect(wrapper.exists()).toBe(true);
    expect(findInputs().length).toBe(store.state.Builder.sizes.length);
  });

  it("size selector item contains size name", () => {
    createComponent({ localVue, store });
    const sizeItem = findInputs().at(0);
    const { name } = sizeItem.props().item;
    expect(sizeItem.text()).toContain(name);
  });

  it("size is checked when its id is state pizza sizeId", () => {
    createComponent({ localVue, store });
    const statePizzaSizeId = store.state.Builder.pizza.sizeId;
    const checkedSize = findCheckedItem(findInputs());
    expect(checkedSize.props().isChecked).toBe(true);
    expect(checkedSize.props().item.id).toBe(statePizzaSizeId);
  });

  it("changing active size sets new state pizza sizeId", async () => {
    createComponent({ localVue, store });
    const notCheckedSize = findNotCheckedItem(findInputs());
    expect(notCheckedSize.props().isChecked).toBe(false);
    notCheckedSize.vm.$emit("change", notCheckedSize.props().item.id);
    await nextTick();
    expect(notCheckedSize.props().isChecked).toBe(true);
    expect(notCheckedSize.props().item.id).toBe(
      store.state.Builder.pizza.sizeId
    );
  });

  it("calls the vuex mutation on size selector change", async () => {
    mutations = {
      Builder: {
        SET_BUILDER_PIZZA_ENTITY: jest.fn(),
      },
    };
    store = generateMockStore({ mutations });
    setSizes(store);
    createComponent({ localVue, store });
    const notCheckedSize = findNotCheckedItem(findInputs());
    expect(notCheckedSize.props().isChecked).toBe(false);
    notCheckedSize.vm.$emit("change", notCheckedSize.props().item.id);
    await nextTick();
    expect(mutations.Builder.SET_BUILDER_PIZZA_ENTITY).toHaveBeenCalled();
  });
});
