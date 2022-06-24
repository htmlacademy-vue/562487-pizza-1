import { createLocalVue, mount } from "@vue/test-utils";
import Vuex from "vuex";
import { generateMockStore } from "@/store/mocks";
import OrderCard from "../components/OrderCard";
import { setUIComponents } from "@/plugins/ui";
import {
  setDoughs,
  setSauces,
  setSizes,
  setIngredients,
  setMisc,
  testOrder,
} from "@/store/mocks/setters";

const localVue = createLocalVue();
localVue.use(Vuex);
setUIComponents(localVue);

describe("OrderCard", () => {
  const propsData = {
    order: testOrder,
  };
  const mocks = {
    $router: {
      push: jest.fn(),
    },
  };
  let store;
  let wrapper;
  const createComponent = (options) => {
    wrapper = mount(OrderCard, options);
  };

  beforeEach(() => {
    mocks.$router.push = jest.fn();
    store = generateMockStore();
    setDoughs(store);
    setSauces(store);
    setSizes(store);
    setIngredients(store);
    setMisc(store);
  });

  afterEach(() => {
    wrapper.destroy();
  });

  it("renders out order card", () => {
    createComponent({ localVue, mocks, store, propsData });
    expect(wrapper.exists()).toBe(true);
  });

  it("renders out order number", () => {
    createComponent({ localVue, mocks, store, propsData });
    const orderNumber = wrapper.find("[data-test='order-number']");
    expect(orderNumber.text()).toBe(`Заказ #${testOrder.id}`);
  });

  it("renders out order total price", () => {
    createComponent({ localVue, mocks, store, propsData });
    const orderTotalPrice = wrapper.find("[data-test='order-sum']");
    const totalPrice = store.getters["Orders/totalPrice"](testOrder);
    expect(orderTotalPrice.text()).toBe(`Сумма заказа: ${totalPrice} ₽`);
  });

  it("emits deleteOrder on delete button click", async () => {
    createComponent({ localVue, mocks, store, propsData });
    const deleteBtn = wrapper.find("[data-test='button-delete']");
    await deleteBtn.trigger("click");
    expect(wrapper.emitted().deleteOrder).toBeTruthy();
    expect(wrapper.emitted().deleteOrder[0][0]).toBe(testOrder.id);
  });

  it("goes to cart route on repeat button click", async () => {
    createComponent({ localVue, mocks, store, propsData });
    const repeatBtn = wrapper.find("[data-test='button-repeat']");
    await repeatBtn.trigger("click");
    expect(mocks.$router.push).toHaveBeenCalledWith({
      name: "Cart",
      params: {
        id: testOrder.id,
      },
    });
  });

  it("renders out pizzas list", () => {
    createComponent({ localVue, mocks, store, propsData });
    const pizzas = wrapper.findAll("[data-test='order-pizza']");
    expect(pizzas.length).toBe(testOrder.orderPizzas.length);
  });

  it("renders out order misc list", () => {
    createComponent({ localVue, mocks, store, propsData });
    const misc = wrapper.findAll("[data-test='order-misc']");
    expect(misc.length).toBe(testOrder.orderMisc.length);
  });

  it("renders out order address when exists", () => {
    createComponent({ localVue, mocks, store, propsData });
    const address = wrapper.find("[data-test='order-address']");
    expect(address.exists()).toBe(true);
    expect(address.text()).toContain(testOrder.orderAddress.name);
  });

  it("does not render out order address when does not exist", () => {
    createComponent({
      localVue,
      mocks,
      store,
      propsData: {
        order: { ...testOrder, orderAddress: null },
      },
    });
    const address = wrapper.find("[data-test='order-address']");
    expect(address.exists()).toBe(false);
  });
});
