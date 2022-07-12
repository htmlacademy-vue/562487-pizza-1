import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuex from "vuex";
import { nextTick } from "vue";
import { generateMockStore } from "@/store/mocks";
import CartPizza from "../components/CartPizza";
import { setLoadData, testCartPizza, setCart } from "@/store/mocks/setters";
import { setUIComponents } from "@/plugins/ui";

const localVue = createLocalVue();
localVue.use(Vuex);
setUIComponents(localVue);

describe("CartPizza", () => {
  const propsData = {
    pizza: testCartPizza,
  };
  const mocks = {
    $router: {
      push: jest.fn(),
    },
  };

  let mutations;
  let store;
  let wrapper;
  const createComponent = (options) => {
    wrapper = shallowMount(CartPizza, options);
  };

  const findPizzaInfo = () => wrapper.findComponent({ name: "PizzaInfo" });
  const findItemCounter = () => wrapper.findComponent({ name: "ItemCounter" });
  const findPizzaPrice = () => wrapper.find("[data-test='pizza-price']");
  const findEditBtn = () => wrapper.find("[data-test='edit-btn']");

  beforeEach(() => {
    mocks.$router.push = jest.fn();
    store = generateMockStore();
    setLoadData(store);
    setCart(store);
  });

  afterEach(() => {
    wrapper.destroy();
  });

  describe("cart pizza", () => {
    it("renders out cart pizza", () => {
      createComponent({ localVue, store, mocks, propsData });
      expect(wrapper.exists()).toBe(true);
    });

    it("renders out pizza info", () => {
      createComponent({ localVue, store, mocks, propsData });
      expect(findPizzaInfo().exists()).toBe(true);
    });

    it("renders out item counter", () => {
      createComponent({ localVue, store, mocks, propsData });
      expect(findItemCounter().exists()).toBe(true);
    });

    it("renders out pizza price", () => {
      const price = store.getters["Builder/pizzaPrice"](testCartPizza);
      const { quantity } = testCartPizza;
      const pizzaSum = price * quantity;
      createComponent({ localVue, store, mocks, propsData });
      const pizzaPrice = findPizzaPrice();
      expect(pizzaPrice.exists()).toBe(true);
      expect(pizzaPrice.text()).toBe(`${pizzaSum} ₽`);
    });

    it("renders out edit button", () => {
      createComponent({ localVue, store, mocks, propsData });
      expect(findEditBtn().exists()).toBe(true);
    });
  });

  describe("item counter events", () => {
    it("calls vuex mutation on ItemCounter incrementClick", async () => {
      mutations = {
        Cart: {
          UPDATE_PIZZA_QUANTITY: jest.fn(),
        },
      };
      store = generateMockStore({ mutations });
      setLoadData(store);
      setCart(store);
      createComponent({ localVue, store, mocks, propsData });
      findItemCounter().vm.$emit("incrementClick");
      await nextTick();
      expect(mutations.Cart.UPDATE_PIZZA_QUANTITY).toHaveBeenCalled();
    });

    it("adds pizza on ItemCounter incrementClick", async () => {
      createComponent({ localVue, store, mocks, propsData });
      expect(store.state.Cart.orderPizzas[0].quantity).toBe(1);
      findItemCounter().vm.$emit("incrementClick");
      await nextTick();
      expect(store.state.Cart.orderPizzas[0].quantity).toBe(2);
    });

    it("calls vuex mutation on ItemCounter decrementClick", async () => {
      mutations = {
        Cart: {
          UPDATE_PIZZA_QUANTITY: jest.fn(),
        },
      };
      store = generateMockStore({ mutations });
      setLoadData(store);
      setCart(store);
      createComponent({
        localVue,
        store,
        mocks,
        propsData: {
          pizza: { ...testCartPizza, quantity: 2 },
        },
      });
      findItemCounter().vm.$emit("decrementClick");
      await nextTick();
      expect(mutations.Cart.UPDATE_PIZZA_QUANTITY).toHaveBeenCalled();
    });

    it("removes pizza on ItemCounter decrementClick", async () => {
      createComponent({
        localVue,
        store,
        mocks,
        propsData: {
          pizza: { ...testCartPizza, quantity: 2 },
        },
      });
      expect(store.state.Cart.orderPizzas[0].quantity).toBe(2);
      findItemCounter().vm.$emit("decrementClick");
      await nextTick();
      expect(store.state.Cart.orderPizzas[0].quantity).toBe(1);
    });

    it("emits deletePizza on ItemCounter decrementClick when last pizza", async () => {
      createComponent({
        localVue,
        store,
        mocks,
        propsData,
      });
      findItemCounter().vm.$emit("decrementClick");
      await nextTick();
      expect(wrapper.emitted().deletePizza[0][0]).toBe(testCartPizza.id);
    });
  });

  describe("edit button click", () => {
    it("goes to root route with params id on edit button click", async () => {
      createComponent({ localVue, store, mocks, propsData });
      findEditBtn().trigger("click");
      await nextTick();
      expect(mocks.$router.push).toHaveBeenCalledWith({
        name: "IndexHome",
        params: { id: testCartPizza.id },
      });
    });
  });
});
