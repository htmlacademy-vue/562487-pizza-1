import { createLocalVue, mount } from "@vue/test-utils";
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
    wrapper = mount(OrderPizza, options);
  };

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

  it("renders out pizza quantity and price", () => {
    createComponent({ localVue, store, propsData });
    const price = wrapper.find("[data-test='pizza-price']");
    const { quantity } = propsData.pizza;
    const pizzaPrice = store.getters["Builder/pizzaPrice"](propsData.pizza);
    expect(price.text()).toContain(`${quantity} х ${pizzaPrice}`);
  });
});
