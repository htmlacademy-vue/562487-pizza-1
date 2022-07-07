import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuex from "vuex";
import { nextTick } from "vue";
import { generateMockStore } from "@/store/mocks";
import BuilderPizzaView from "../components/BuilderPizzaView";
import { setUIComponents } from "@/plugins/ui";
import {
  setLoadData,
  testPizza,
  testIngredients,
  addIngredient,
  setPizzaIngredients,
} from "@/store/mocks/setters";

const localVue = createLocalVue();
localVue.use(Vuex);
setUIComponents(localVue);

describe("BuilderPizzaView", () => {
  const firstIngredient = {
    ingredientId: 1,
    quantity: 1,
  };
  const secondIngredient = { ...firstIngredient, quantity: 2 };
  const thirdIngredient = { ...firstIngredient, quantity: 3 };

  let mutations;
  let store;
  let wrapper;
  const createComponent = (options) => {
    wrapper = shallowMount(BuilderPizzaView, options);
  };

  const findAppDrop = () => wrapper.findComponent({ name: "AppDrop" });
  const findPizzaFoundation = () =>
    wrapper.find("[data-test='pizza-foundation']");
  const findFillingItems = () => wrapper.findAll("[data-test='filling-item']");
  const findDoubleFilling = () => wrapper.find("[data-quantity='2']");
  const findTripleFilling = () => wrapper.find("[data-quantity='3']");

  beforeEach(() => {
    store = generateMockStore();
    setLoadData(store);
    addIngredient(store, firstIngredient);
    addIngredient(store, secondIngredient);
    addIngredient(store, thirdIngredient);
  });

  afterEach(() => {
    wrapper.destroy();
  });

  describe("pizza view", () => {
    it("renders out pizza view", () => {
      createComponent({ localVue, store });
      expect(wrapper.exists()).toBe(true);
    });

    it("renders out app drop", () => {
      createComponent({ localVue, store });
      expect(findAppDrop().exists()).toBe(true);
    });

    it("renders out pizza foundation", () => {
      createComponent({ localVue, store });
      expect(findPizzaFoundation().exists()).toBe(true);
    });

    it("adds pizza foundation classes", () => {
      createComponent({ localVue, store });
      const { doughId, sauceId } = testPizza;
      const foundation = store.getters["Builder/doughById"](doughId).foundation;
      const sauce = store.getters["Builder/sauceById"](sauceId).value;
      const foundationClasses = `pizza--foundation--${foundation}-${sauce}`;
      expect(findPizzaFoundation().classes(foundationClasses)).toBe(true);
    });
  });

  describe("pizza fillings", () => {
    it("renders out pizza fillings", () => {
      createComponent({ localVue, store });
      expect(findFillingItems().length).toBe(
        store.state.Builder.pizza.ingredients.length
      );
    });

    it("adds pizza filling classes with ingredient value modifier", () => {
      createComponent({ localVue, store });
      const fillingItems = findFillingItems();
      const { ingredients } = store.state.Builder.pizza;
      for (let i = 0; i < ingredients.length; i++) {
        let value = testIngredients.find(
          (it) => it.ingredientId === ingredients[i].ingredientId
        )?.value;
        expect(fillingItems.at(i).classes("pizza__filling--" + value)).toBe(
          true
        );
      }
    });

    it("adds pizza filling classes with --second modifier when quantity equals 2", () => {
      createComponent({ localVue, store });
      expect(findDoubleFilling().classes("pizza__filling--second")).toBe(true);
    });

    it("pizza filling has classes with --third modifier when quantity equals 3", () => {
      createComponent({ localVue, store });
      expect(findTripleFilling().classes("pizza__filling--third")).toBe(true);
    });
  });

  describe("move ingredient", () => {
    it("calls vuex mutation when app drop emits drop", async () => {
      mutations = {
        Builder: {
          ADD_BUILDER_PIZZA_INGREDIENT: jest.fn(),
        },
      };
      store = generateMockStore({ mutations });
      setLoadData(store);
      addIngredient(store, firstIngredient);
      createComponent({ localVue, store });
      findAppDrop().vm.$emit("drop", { ingredientId: firstIngredient.id });
      await nextTick();
      expect(mutations.Builder.ADD_BUILDER_PIZZA_INGREDIENT).toHaveBeenCalled();
    });

    it("adds 1 item of ingredient to pizza when app drop emits drop", async () => {
      setPizzaIngredients(store, []);
      createComponent({ localVue, store });
      expect(store.state.Builder.pizza.ingredients.length).toBe(0);
      findAppDrop().vm.$emit("drop", { ingredientId: firstIngredient.id });
      await nextTick();
      expect(store.state.Builder.pizza.ingredients.length).toBe(1);
    });
  });
});
