import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuex from "vuex";
import { nextTick } from "vue";
import flushPromises from "flush-promises";
import { generateMockStore } from "@/store/mocks";
import Cart from "../Cart";
import { setUIComponents } from "@/plugins/ui";
import {
  setCart,
  testOrder,
  setOrders,
  setUser,
  setLoadData,
  testCartPizza,
} from "@/store/mocks/setters";
import { Pizza } from "@/common/models";

const localVue = createLocalVue();
localVue.use(Vuex);
setUIComponents(localVue);

describe("Cart", () => {
  const stubs = ["router-link"];
  const mocks = {
    $route: {
      params: {},
    },
    $router: {
      push: jest.fn(),
    },
  };
  let actions;
  let store;
  let wrapper;
  const createComponent = (options) => {
    wrapper = shallowMount(Cart, options);
  };

  beforeEach(() => {
    mocks.$router.push = jest.fn();
    actions = {
      Auth: {
        queryAddresses: jest.fn(() => Promise.resolve()),
      },
      Orders: {
        createOrder: jest.fn(() => Promise.resolve()),
      },
    };
    store = generateMockStore(actions);
    setLoadData(store);
  });

  afterEach(() => {
    wrapper.destroy();
  });

  it("renders out cart empty", () => {
    createComponent({ localVue, store, stubs, mocks });
    expect(wrapper.exists()).toBe(true);
    const cartEmpty = wrapper.find("[data-test='cart-empty']");
    expect(cartEmpty.exists()).toBe(true);
  });

  it("renders out cart content when not empty cart", () => {
    setCart(store);
    createComponent({ localVue, store, stubs, mocks });
    const cartContent = wrapper.find("[data-test='cart-content']");
    expect(cartContent.exists()).toBe(true);
  });

  it("renders out cart footer", () => {
    createComponent({ localVue, store, stubs, mocks });
    const cartFooter = wrapper.findComponent({ name: "CartFooter" });
    expect(cartFooter.exists()).toBe(true);
  });

  it("renders out cart popup when isSuccessPopupShowed", async () => {
    setCart(store);
    createComponent({ localVue, store, stubs, mocks });
    await wrapper.setData({
      isSuccessPopupShowed: true,
    });
    const popup = wrapper.findComponent({ name: "CartPopup" });
    expect(popup.exists()).toBe(true);
  });

  it("does not render out cart popup", async () => {
    setCart(store);
    createComponent({ localVue, store, stubs, mocks });
    const popup = wrapper.findComponent({ name: "CartPopup" });
    expect(popup.exists()).toBe(false);
    expect(wrapper.vm.isSuccessPopupShowed).toBe(false);
  });

  it("renders out confirm popup when isConfirmPopupShowed", async () => {
    setCart(store);
    createComponent({ localVue, store, stubs, mocks });
    await wrapper.setData({
      isConfirmPopupShowed: true,
      pizzaIdToDelete: testCartPizza.id,
    });
    const popup = wrapper.findComponent({ name: "ConfirmPopup" });
    expect(popup.exists()).toBe(true);
  });

  it("does not render out confirm popup", async () => {
    setCart(store);
    createComponent({ localVue, store, stubs, mocks });
    const popup = wrapper.findComponent({ name: "ConfirmPopup" });
    expect(popup.exists()).toBe(false);
    expect(wrapper.vm.isConfirmPopupShowed).toBe(false);
  });

  it("does not call vuex action when created without user", async () => {
    setCart(store);
    createComponent({ localVue, store, stubs, mocks });
    await flushPromises();
    expect(actions.Auth.queryAddresses).not.toHaveBeenCalled();
  });

  it("calls vuex action when not empty cart created with user", async () => {
    setCart(store);
    setUser(store);
    createComponent({ localVue, store, stubs, mocks });
    await flushPromises();
    expect(actions.Auth.queryAddresses).toHaveBeenCalled();
  });

  it("calls vuex action when created with user and order id", async () => {
    mocks.$route.params.id = testOrder.id;
    setUser(store);
    setOrders(store);
    createComponent({ localVue, store, stubs, mocks });
    await flushPromises();
    expect(actions.Auth.queryAddresses).toHaveBeenCalled();
  });

  it("calls vuex mutations when created with user and order id", async () => {
    mocks.$route.params.id = testOrder.id;
    setUser(store);
    setOrders(store);
    createComponent({ localVue, store, stubs, mocks });
    const spyOnUpdateCart = jest.spyOn(wrapper.vm, "updateCart");
    await flushPromises();
    expect(spyOnUpdateCart).toHaveBeenNthCalledWith(1, {
      delivery: testOrder.orderAddress.id,
      phone: testOrder.phone,
      orderAddress: testOrder.orderAddress,
      orderPizzas: Pizza.parseItems(testOrder.orderPizzas),
      orderMisc: testOrder.orderMisc,
    });
  });

  it("calls vuex action to create order on submit", async () => {
    mocks.$route.params.id = testOrder.id;
    setUser(store);
    setOrders(store);
    createComponent({ localVue, store, stubs, mocks });
    const spyOnCreate = jest.spyOn(wrapper.vm, "createOrder");
    await flushPromises();
    const form = wrapper.find("form");
    await form.trigger("submit");
    expect(spyOnCreate).toHaveBeenCalledWith({
      userId: testOrder.userId,
      phone: testOrder.phone,
      pizzas: Pizza.parseItems(testOrder.orderPizzas).map((it) => it.toRaw()),
      misc: testOrder.orderMisc,
      address: testOrder.orderAddress,
    });
  });

  it("calls vuex mutation to reset cart on submit success", async () => {
    mocks.$route.params.id = testOrder.id;
    setUser(store);
    setOrders(store);
    createComponent({ localVue, store, stubs, mocks });
    const spyOnReset = jest.spyOn(wrapper.vm, "resetCart");
    await flushPromises();
    const form = wrapper.find("form");
    await form.trigger("submit");
    await nextTick();
    expect(spyOnReset).toHaveBeenCalled();
  });

  it("shows success popup on submit success", async () => {
    mocks.$route.params.id = testOrder.id;
    setUser(store);
    setOrders(store);
    createComponent({ localVue, store, stubs, mocks });
    await flushPromises();
    expect(wrapper.vm.isSuccessPopupShowed).toBe(false);
    const form = wrapper.find("form");
    await form.trigger("submit");
    await nextTick();
    expect(wrapper.vm.isSuccessPopupShowed).toBe(true);
  });

  it("sets isSubmitting to false when submit error", async () => {
    mocks.$route.params.id = testOrder.id;
    actions.Orders.createOrder = jest.fn(() => Promise.reject());
    store = generateMockStore(actions);
    setLoadData(store);
    setUser(store);
    setOrders(store);
    createComponent({ localVue, store, stubs, mocks });
    await flushPromises();
    const form = wrapper.find("form");
    await form.trigger("submit");
    expect(wrapper.vm.isSubmitting).toBe(true);
    await nextTick();
    await nextTick();
    expect(wrapper.vm.isSubmitting).toBe(false);
  });

  it("goes to orders route on cart popup transition leave when user exists", async () => {
    mocks.$route.params.id = testOrder.id;
    setUser(store);
    setOrders(store);
    createComponent({ localVue, store, stubs, mocks });
    await flushPromises();
    const form = wrapper.find("form");
    await form.trigger("submit");
    await nextTick();
    const cartPopupTransition = wrapper.find(
      "[data-test='cart-popup-transition']"
    );
    cartPopupTransition.vm.$emit("leave");
    expect(mocks.$router.push).toHaveBeenCalledWith("/orders");
  });

  it("goes to root route on cart popup transition leave when no user", async () => {
    setCart(store);
    createComponent({ localVue, store, stubs, mocks });
    await flushPromises();
    const form = wrapper.find("form");
    await form.trigger("submit");
    await nextTick();
    const cartPopupTransition = wrapper.find(
      "[data-test='cart-popup-transition']"
    );
    cartPopupTransition.vm.$emit("leave");
    expect(mocks.$router.push).toHaveBeenCalledWith("/");
  });

  it("closes cart popup on close", async () => {
    setCart(store);
    createComponent({ localVue, store, stubs, mocks });
    await flushPromises();
    const form = wrapper.find("form");
    await form.trigger("submit");
    await nextTick();
    const cartPopup = wrapper.findComponent({ name: "CartPopup" });
    cartPopup.vm.$emit("close");
    await nextTick();
    expect(wrapper.vm.isSuccessPopupShowed).toBe(false);
    expect(wrapper.findComponent({ name: "CartPopup" }).exists()).toBe(false);
  });

  it("shows confirm popup when cart pizzas emit deletePizza", async () => {
    setCart(store);
    createComponent({ localVue, store, stubs, mocks });
    await flushPromises();
    expect(wrapper.vm.pizzaIdToDelete).toBe(null);
    expect(wrapper.vm.isConfirmPopupShowed).toBe(false);
    const cartPizzas = wrapper.findComponent({ name: "CartPizzas" });
    cartPizzas.vm.$emit("deletePizza", testCartPizza.id);
    await nextTick();
    expect(wrapper.vm.pizzaIdToDelete).toBe(testCartPizza.id);
    expect(wrapper.vm.isConfirmPopupShowed).toBe(true);
  });

  it("closes confirm popup when confirm popup emits cancel", async () => {
    setCart(store);
    createComponent({ localVue, store, stubs, mocks });
    await flushPromises();
    await wrapper.setData({
      isConfirmPopupShowed: true,
      pizzaIdToDelete: testCartPizza.id,
    });
    const confirmPopup = wrapper.findComponent({ name: "ConfirmPopup" });
    expect(wrapper.vm.isConfirmPopupShowed).toBe(true);
    confirmPopup.vm.$emit("cancel");
    await nextTick();
    expect(wrapper.vm.isConfirmPopupShowed).toBe(false);
  });

  it("calls vuex action when confirm popup emits confirm", async () => {
    setCart(store);
    createComponent({ localVue, store, stubs, mocks });
    await flushPromises();
    await wrapper.setData({
      isConfirmPopupShowed: true,
      pizzaIdToDelete: testCartPizza.id,
    });
    const spyOnDeletePizza = jest.spyOn(wrapper.vm, "deletePizza");
    const confirmPopup = wrapper.findComponent({ name: "ConfirmPopup" });
    confirmPopup.vm.$emit("confirm");
    await nextTick();
    expect(spyOnDeletePizza).toHaveBeenCalledWith(testCartPizza.id);
  });

  it("closes confirm popup when confirm popup emits confirm", async () => {
    setCart(store);
    createComponent({ localVue, store, stubs, mocks });
    await flushPromises();
    await wrapper.setData({
      isConfirmPopupShowed: true,
      pizzaIdToDelete: testCartPizza.id,
    });
    const confirmPopup = wrapper.findComponent({ name: "ConfirmPopup" });
    confirmPopup.vm.$emit("confirm");
    await nextTick();
    expect(wrapper.vm.isConfirmPopupShowed).toBe(false);
  });

  it("calls vuex mutation to reset cart when confirm popup emits confirm and no more pizzas", async () => {
    setCart(store);
    createComponent({ localVue, store, stubs, mocks });
    await flushPromises();
    await wrapper.setData({
      isConfirmPopupShowed: true,
      pizzaIdToDelete: testCartPizza.id,
    });
    const spyOnReset = jest.spyOn(wrapper.vm, "resetCart");
    const confirmPopup = wrapper.findComponent({ name: "ConfirmPopup" });
    confirmPopup.vm.$emit("confirm");
    await nextTick();
    expect(spyOnReset).toHaveBeenCalled();
  });
});
