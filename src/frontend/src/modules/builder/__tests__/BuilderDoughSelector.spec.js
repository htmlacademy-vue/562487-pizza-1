import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuex from "vuex";
import { nextTick } from "vue";
import { generateMockStore } from "@/store/mocks";
import BuilderDoughSelector from "../components/BuilderDoughSelector";
import { setDoughs } from "@/store/mocks/setters";
import { setUIComponents } from "@/plugins/ui";
import { findCheckedItem, findNotCheckedItem } from "@/common/helpers";

const localVue = createLocalVue();
localVue.use(Vuex);
setUIComponents(localVue);

describe("BuilderDoughSelector", () => {
  let mutations;
  let store;
  let wrapper;
  const createComponent = (options) => {
    wrapper = shallowMount(BuilderDoughSelector, options);
  };

  const findInputs = () => wrapper.findAllComponents({ name: "RadioButton" });

  beforeEach(() => {
    mutations = {
      Builder: {},
    };
    store = generateMockStore({ mutations });
    setDoughs(store);
  });

  afterEach(() => {
    wrapper.destroy();
  });

  it("renders out dough content", () => {
    createComponent({ localVue, store });
    expect(wrapper.exists()).toBe(true);
    expect(findInputs().length).toBe(store.state.Builder.doughs.length);
  });

  it("dough selector item contains dough name and description", () => {
    createComponent({ localVue, store });
    const doughItem = findInputs().at(0);
    const { name, description } = doughItem.props().item;
    expect(doughItem.text()).toContain(name);
    expect(doughItem.text()).toContain(description);
  });

  it("dough is checked when its id is state pizza doughId", () => {
    createComponent({ localVue, store });
    const statePizzaDoughId = store.state.Builder.pizza.doughId;
    const checkedDough = findCheckedItem(findInputs());
    expect(checkedDough.props().isChecked).toBe(true);
    expect(checkedDough.props().item.id).toBe(statePizzaDoughId);
  });

  it("changing active dough sets new state pizza doughId", async () => {
    createComponent({ localVue, store });
    const notCheckedDough = findNotCheckedItem(findInputs());
    expect(notCheckedDough.props().isChecked).toBe(false);
    notCheckedDough.vm.$emit("change", notCheckedDough.props().item.id);
    await nextTick();
    expect(notCheckedDough.props().isChecked).toBe(true);
    expect(notCheckedDough.props().item.id).toBe(
      store.state.Builder.pizza.doughId
    );
  });

  it("calls the vuex mutation on dough selector change", async () => {
    mutations = {
      Builder: {
        SET_BUILDER_PIZZA_ENTITY: jest.fn(),
      },
    };
    store = generateMockStore({ mutations });
    setDoughs(store);
    createComponent({ localVue, store });
    const notCheckedDough = findNotCheckedItem(findInputs());
    expect(notCheckedDough.props().isChecked).toBe(false);
    notCheckedDough.vm.$emit("change", notCheckedDough.props().item.id);
    await nextTick();
    expect(mutations.Builder.SET_BUILDER_PIZZA_ENTITY).toHaveBeenCalled();
  });
});
