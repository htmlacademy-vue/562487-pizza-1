import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuex from "vuex";
import { generateMockStore } from "@/store/mocks";
import OrderPizza from "../components/OrderPizza";
import { setUIComponents } from "@/plugins/ui";
import { setLoadData, testOrder } from "@/store/mocks/setters";

const localVue = createLocalVue();
localVue.use(Vuex);
setUIComponents(localVue);

describe("OrderPizza", () => {
  const propsData = {
    pizza: testOrder.orderPizzas[0],
  };
  let store;
  let wrapper;
  const createComponent = (options) => {
    wrapper = shallowMount(OrderPizza, options);
  };

  const findProduct = () => wrapper.findComponent({ name: "Product" });
  const findPrice = () => wrapper.find("[data-test='pizza-price']");

  beforeEach(() => {
    store = generateMockStore();
    setLoadData(store);
  });

  afterEach(() => {
    wrapper.destroy();
  });

  it("renders out order pizza", () => {
    createComponent({ localVue, store, propsData });
    expect(wrapper.exists()).toBe(true);
  });

  it("renders out product", () => {
    createComponent({ localVue, store, propsData });
    expect(findProduct().exists()).toBe(true);
  });

  it("renders out pizza quantity and price if quantity > 1", () => {
    const pizzaQuantity = 2;
    createComponent({
      localVue,
      store,
      propsData: {
        pizza: { ...propsData.pizza, quantity: pizzaQuantity },
      },
    });
    const pizzaPrice = store.getters["Builder/pizzaPrice"](propsData.pizza);
    expect(findPrice().text()).toBe(`${pizzaQuantity} х ${pizzaPrice} ₽`);
  });

  it("renders out pizza price if quantity = 1", () => {
    createComponent({ localVue, store, propsData });
    const pizzaPrice = store.getters["Builder/pizzaPrice"](propsData.pizza);
    expect(findPrice().text()).toBe(`${pizzaPrice} ₽`);
  });
});
