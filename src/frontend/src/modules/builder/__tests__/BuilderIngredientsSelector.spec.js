import { createLocalVue, mount } from "@vue/test-utils";
import Vuex from "vuex";
import { nextTick } from "vue";
import { generateMockStore } from "@/store/mocks";
import BuilderIngredientsSelector from "../components/BuilderIngredientsSelector";
import { setSauces, setIngredients } from "@/store/mocks/setters";
import { setUIComponents } from "@/plugins/ui";
import { findCheckedItem, findNotCheckedItem } from "@/common/helpers";

const localVue = createLocalVue();
localVue.use(Vuex);
setUIComponents(localVue);

describe("BuilderIngredientsSelector", () => {
  let mutations;
  let store;
  let wrapper;
  const createComponent = (options) => {
    wrapper = mount(BuilderIngredientsSelector, options);
  };

  const findSauces = () => wrapper.findAll("[data-test='sauce']");
  const findIngredients = () => wrapper.findAll("[data-test='ingredient']");

  beforeEach(() => {
    store = generateMockStore();
    setSauces(store);
    setIngredients(store);
  });

  afterEach(() => {
    wrapper.destroy();
  });

  describe("ingredients selector", () => {
    it("renders out content", () => {
      createComponent({ localVue, store });
      expect(wrapper.exists()).toBe(true);
    });

    it("renders out ingredients", () => {
      createComponent({ localVue, store });
      expect(findIngredients().length).toBe(
        store.state.Builder.ingredients.length
      );
    });
  });

  describe("sauces", () => {
    it("renders out sauces", () => {
      createComponent({ localVue, store });
      expect(findSauces().length).toBe(store.state.Builder.sauces.length);
    });

    it("sauce is checked when its id is state pizza sauceId", () => {
      createComponent({ localVue, store });
      const statePizzaSauceId = store.state.Builder.pizza.sauceId;
      const checkedSauce = findCheckedItem(findSauces());
      expect(checkedSauce.props().isChecked).toBe(true);
      expect(checkedSauce.props().item.id).toBe(statePizzaSauceId);
    });

    it("changing active sauce sets new state pizza sauceId", async () => {
      createComponent({ localVue, store });
      const notCheckedSauce = findNotCheckedItem(findSauces());
      expect(notCheckedSauce.props().isChecked).toBe(false);
      notCheckedSauce.vm.$emit("change", notCheckedSauce.props().item.id);
      await nextTick();
      expect(notCheckedSauce.props().isChecked).toBe(true);
      expect(notCheckedSauce.props().item.id).toBe(
        store.state.Builder.pizza.sauceId
      );
    });

    it("calls the vuex mutation on sauce selector change", async () => {
      mutations = {
        Builder: {
          SET_BUILDER_PIZZA_ENTITY: jest.fn(),
        },
      };
      store = generateMockStore({ mutations });
      setSauces(store);
      setIngredients(store);
      createComponent({ localVue, store });
      const notCheckedSauce = findNotCheckedItem(findSauces());
      expect(notCheckedSauce.props().isChecked).toBe(false);
      notCheckedSauce.vm.$emit("change", notCheckedSauce.props().item.id);
      await nextTick();
      expect(mutations.Builder.SET_BUILDER_PIZZA_ENTITY).toHaveBeenCalled();
    });
  });
});
