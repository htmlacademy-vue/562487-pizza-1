import { createLocalVue, mount } from "@vue/test-utils";
import Vuex from "vuex";
import { generateMockStore } from "@/store/mocks";
import CartPizzas from "../components/CartPizzas";
import ItemCounter from "@/common/components/ItemCounter";
import { setLoadData, testCartPizza } from "@/store/mocks/setters";
import { setUIComponents } from "@/plugins/ui";

const localVue = createLocalVue();
localVue.use(Vuex);
setUIComponents(localVue);

describe("CartPizzas", () => {
  const propsData = {
    pizzas: [testCartPizza],
  };
  const mocks = {
    $router: {
      push: jest.fn(),
    },
  };
  let store;
  let wrapper;
  const createComponent = (options) => {
    wrapper = mount(CartPizzas, options);
  };

  beforeEach(() => {
    mocks.$router.push = jest.fn();
    store = generateMockStore();
    setLoadData(store);
  });

  afterEach(() => {
    wrapper.destroy();
  });

  it("renders out prop pizzas", () => {
    createComponent({ localVue, store, mocks, propsData });
    const pizzaItems = wrapper.findAll("[data-test='pizza-item']");
    expect(wrapper.exists()).toBe(true);
    expect(pizzaItems.length).toBe(propsData.pizzas.length);
  });

  it("displays pizza group price", () => {
    createComponent({
      localVue,
      store,
      mocks,
      propsData: { pizzas: [{ ...testCartPizza, quantity: 2 }] },
    });
    const pizzasPrice = wrapper.find("[data-test='pizzas-price']");
    const priceValue = store.getters["Builder/pizzaPrice"](testCartPizza) * 2;
    expect(pizzasPrice.text()).toContain(priceValue);
  });

  it("calls vuex mutation on ItemCounter incrementClick", async () => {
    createComponent({ localVue, store, mocks, propsData });
    const spyOnUpdate = jest.spyOn(wrapper.vm, "updatePizzaQuantity");
    const itemCounter = wrapper.findComponent(ItemCounter);
    itemCounter.vm.$emit("incrementClick");
    expect(spyOnUpdate).toHaveBeenCalledWith({
      id: testCartPizza.id,
      quantity: testCartPizza.quantity + 1,
    });
  });

  it("calls vuex mutation on ItemCounter decrementClick", () => {
    const quantity = 2;
    createComponent({
      localVue,
      store,
      mocks,
      propsData: { pizzas: [{ ...testCartPizza, quantity }] },
    });
    const spyOnUpdate = jest.spyOn(wrapper.vm, "updatePizzaQuantity");
    const itemCounter = wrapper.findComponent(ItemCounter);
    itemCounter.vm.$emit("decrementClick");
    expect(spyOnUpdate).toHaveBeenCalledWith({
      id: testCartPizza.id,
      quantity: quantity - 1,
    });
  });

  it("emits deletePizza with id on ItemCounter decrementClick", async () => {
    createComponent({ localVue, store, mocks, propsData });
    const itemCounter = wrapper.findComponent(ItemCounter);
    itemCounter.vm.$emit("decrementClick");
    expect(wrapper.emitted().deletePizza[0][0]).toBe(propsData.pizzas[0].id);
  });

  it("goes to root route with params id on edit button click", async () => {
    createComponent({ localVue, store, mocks, propsData });
    const editBtn = wrapper.find("[data-test='edit-btn']");
    await editBtn.trigger("click");
    expect(mocks.$router.push).toHaveBeenCalledWith({
      name: "IndexHome",
      params: { id: testCartPizza.id },
    });
  });
});
