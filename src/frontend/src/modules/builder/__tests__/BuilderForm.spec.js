import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuex from "vuex";
import { nextTick } from "vue";
import { generateMockStore } from "@/store/mocks";
import BuilderForm from "../components/BuilderForm";
import { testPizza, setPizza, setCartPizzas } from "@/store/mocks/setters";
import { setUIComponents } from "@/plugins/ui";
import { Pizza } from "@/common/models";

const localVue = createLocalVue();
localVue.use(Vuex);
setUIComponents(localVue);

describe("BuilderForm", () => {
  const propsData = {
    isEditMode: false,
  };
  const mocks = {
    $router: {
      push: jest.fn(),
    },
    $notifier: {
      success: jest.fn(),
    },
  };
  let mutations;
  let store;
  let wrapper;
  const createComponent = (options) => {
    wrapper = shallowMount(BuilderForm, options);
  };

  const findForm = () => wrapper.find("form");
  const findDoughSelector = () =>
    wrapper.findComponent({ name: "BuilderDoughSelector" });
  const findSizeSelector = () =>
    wrapper.findComponent({ name: "BuilderSizeSelector" });
  const findIngredientsSelector = () =>
    wrapper.findComponent({ name: "BuilderIngredientsSelector" });
  const findNameInput = () => wrapper.find("[data-test='pizza-name']");
  const findPizzaView = () =>
    wrapper.findComponent({ name: "BuilderPizzaView" });
  const findPizzaResult = () =>
    wrapper.findComponent({ name: "BuilderPizzaResult" });

  const triggerSubmit = async () => {
    findForm().trigger("submit");
    await nextTick();
  };

  beforeEach(() => {
    mocks.$router.push = jest.fn();
    mocks.$notifier.success = jest.fn();
    store = generateMockStore();
    setPizza(store);
  });

  afterEach(() => {
    wrapper.destroy();
  });

  describe("builder form", () => {
    it("renders out builder form", () => {
      createComponent({ localVue, store, propsData });
      expect(findForm().exists()).toBe(true);
    });

    it("renders out dough selector", () => {
      createComponent({ localVue, store, propsData });
      expect(findDoughSelector().exists()).toBe(true);
    });

    it("renders out size selector", () => {
      createComponent({ localVue, store, propsData });
      expect(findSizeSelector().exists()).toBe(true);
    });

    it("renders out ingredients selector", () => {
      createComponent({ localVue, store, propsData });
      expect(findIngredientsSelector().exists()).toBe(true);
    });

    it("renders out pizza name input", () => {
      createComponent({ localVue, store, propsData });
      expect(findNameInput().exists()).toBe(true);
    });

    it("renders out pizza view", () => {
      createComponent({ localVue, store, propsData });
      expect(findPizzaView().exists()).toBe(true);
    });

    it("renders out pizza result", () => {
      createComponent({ localVue, store, propsData });
      expect(findPizzaResult().exists()).toBe(true);
    });
  });

  describe("pizza name input", () => {
    it("pizza name input value is state builder pizza name", () => {
      createComponent({ localVue, store, propsData });
      expect(findNameInput().props().value).toBe(testPizza.name);
    });

    it("calls vuex mutation on pizza name input", async () => {
      mutations = {
        Builder: {
          SET_BUILDER_PIZZA_ENTITY: jest.fn(),
        },
      };
      store = generateMockStore({ mutations });
      setPizza(store);
      const pizzaName = "Pizzzka";
      createComponent({ localVue, store, propsData });
      const nameInput = findNameInput();
      nameInput.vm.$emit("input", pizzaName);
      await nextTick();
      expect(mutations.Builder.SET_BUILDER_PIZZA_ENTITY).toHaveBeenCalled();
    });

    it("sets state pizza name on pizza name input", async () => {
      const pizzaName = "Pizzzka";
      createComponent({ localVue, store, propsData });
      findNameInput().vm.$emit("input", pizzaName);
      await nextTick();
      expect(store.state.Builder.pizza.name).toBe(pizzaName);
    });
  });

  describe("when submit", () => {
    it("calls vuex mutation to add pizza to cart", async () => {
      mutations = {
        Cart: {
          ADD_PIZZA: jest.fn(),
        },
      };
      store = generateMockStore({ mutations });
      setPizza(store);
      createComponent({ localVue, store, mocks, propsData });
      await triggerSubmit();
      expect(mutations.Cart.ADD_PIZZA).toHaveBeenCalled();
    });

    it("adds pizza to cart state orderPizzas", async () => {
      createComponent({ localVue, store, mocks, propsData });
      expect(store.state.Cart.orderPizzas.length).toBe(0);
      await triggerSubmit();
      expect(store.state.Cart.orderPizzas.length).toBe(1);
    });

    it("calls vuex mutation to update pizza when prop isEditMode", async () => {
      mutations = {
        Cart: {
          UPDATE_PIZZA: jest.fn(),
        },
      };
      store = generateMockStore({ mutations });
      createComponent({
        localVue,
        store,
        mocks,
        propsData: { ...propsData, isEditMode: true },
      });
      await triggerSubmit();
      expect(mutations.Cart.UPDATE_PIZZA).toHaveBeenCalled();
    });

    it("updates pizza in cart state orderPizzas", async () => {
      setCartPizzas(store, [testPizza]);
      createComponent({
        localVue,
        store,
        mocks,
        propsData: { ...propsData, isEditMode: true },
      });
      expect(store.state.Cart.orderPizzas[0].name).toBe(testPizza.name);
      const newPizzaName = "New Pizza Name";
      findNameInput().vm.$emit("input", newPizzaName);
      await nextTick();
      await triggerSubmit();
      expect(store.state.Cart.orderPizzas[0].name).toBe(newPizzaName);
    });

    it("emits save on submit when prop isEditMode", async () => {
      createComponent({
        localVue,
        store,
        mocks,
        propsData: { ...propsData, isEditMode: true },
      });
      await triggerSubmit();
      expect(wrapper.emitted().save).toBeTruthy();
    });

    it("calls router push when prop isEditMode", async () => {
      createComponent({
        localVue,
        store,
        mocks,
        propsData: { ...propsData, isEditMode: true },
      });
      await triggerSubmit();
      expect(mocks.$router.push).toHaveBeenCalledWith("/cart");
    });

    it("calls notifier plugin success message", async () => {
      const message = `Пицца ${testPizza.name} создана`;
      createComponent({ localVue, store, mocks, propsData });
      await triggerSubmit();
      expect(mocks.$notifier.success).toHaveBeenCalledWith(message);
    });

    it("calls vuex mutation to reset builder pizza", async () => {
      mutations = {
        Builder: {
          RESET_BUILDER_PIZZA: jest.fn(),
        },
      };
      store = generateMockStore({ mutations });
      setPizza(store);
      createComponent({ localVue, store, mocks, propsData });
      await triggerSubmit();
      expect(mutations.Builder.RESET_BUILDER_PIZZA).toHaveBeenCalled();
    });

    it("resets state builder pizza", async () => {
      createComponent({ localVue, store, mocks, propsData });
      await triggerSubmit();
      const newPizza = Pizza.createNew();
      const { doughId, sauceId, sizeId, name, ingredients, quantity } =
        store.state.Builder.pizza;
      expect(doughId).toBe(newPizza.doughId);
      expect(sauceId).toBe(newPizza.sauceId);
      expect(sizeId).toBe(newPizza.sizeId);
      expect(name).toBe(newPizza.name);
      expect(ingredients).toEqual(newPizza.ingredients);
      expect(quantity).toBe(newPizza.quantity);
    });
  });
});
