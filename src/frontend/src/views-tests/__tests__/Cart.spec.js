import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuex from "vuex";
import { nextTick } from "vue";
import flushPromises from "flush-promises";
import { generateMockStore } from "@/store/mocks";
import Cart from "@/views/Cart";
import { setUIComponents } from "@/plugins/ui";
import {
  setCart,
  testOrder,
  setOrders,
  setUser,
  setLoadData,
  testCartPizza,
} from "@/store/mocks/setters";
import { BASE_DELIVERIES } from "@/common/constants";
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
  let mutations;
  let actions;
  let store;
  let wrapper;
  const createComponent = (options) => {
    wrapper = shallowMount(Cart, options);
  };

  const findCartEmpty = () => wrapper.find("[data-test='cart-empty']");
  const findCartContent = () => wrapper.find("[data-test='cart-content']");
  const findCartFooter = () => wrapper.findComponent({ name: "CartFooter" });
  const findCartPopup = () => wrapper.findComponent({ name: "CartPopup" });
  const findCartPopupTransition = () =>
    wrapper.find("[data-test='cart-popup-transition']");
  const findPizzas = () => wrapper.findAllComponents({ name: "CartPizza" });
  const findConfirmPopup = () =>
    wrapper.findComponent({ name: "ConfirmPopup" });
  const findForm = () => wrapper.find("form");

  const triggerSubmit = async () => {
    findForm().trigger("submit");
    await nextTick();
  };

  const showConfirmPopup = async () => {
    findPizzas().at(0).vm.$emit("deletePizza", testCartPizza.id);
    await nextTick();
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
      Cart: {
        deletePizza: jest.fn(),
      },
    };
    store = generateMockStore({ actions });
    setLoadData(store);
  });

  afterEach(() => {
    wrapper.destroy();
  });

  describe("cart view", () => {
    it("renders out cart empty", () => {
      createComponent({ localVue, store, stubs, mocks });
      expect(wrapper.exists()).toBe(true);
      expect(findCartEmpty().exists()).toBe(true);
    });

    it("renders out cart content when not empty cart", () => {
      setCart(store);
      createComponent({ localVue, store, stubs, mocks });
      expect(findCartContent().exists()).toBe(true);
    });

    it("renders out state pizzas", () => {
      setCart(store);
      createComponent({ localVue, store, stubs, mocks });
      expect(findPizzas()).toHaveLength(store.state.Cart.orderPizzas.length);
    });

    it("renders out cart content when repeat order", async () => {
      mocks.$route.params.id = testOrder.id;
      setUser(store);
      setOrders(store);
      createComponent({ localVue, store, stubs, mocks });
      await flushPromises();
      expect(findCartContent().exists()).toBe(true);
    });

    it("renders out cart footer", () => {
      createComponent({ localVue, store, stubs, mocks });
      expect(findCartFooter().exists()).toBe(true);
    });

    it("does not render out cart popup", async () => {
      setCart(store);
      createComponent({ localVue, store, stubs, mocks });
      expect(findCartPopup().exists()).toBe(false);
    });

    it("does not render out confirm popup", async () => {
      setCart(store);
      createComponent({ localVue, store, stubs, mocks });
      expect(findConfirmPopup().exists()).toBe(false);
    });
  });

  describe("when created", () => {
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

    it("calls vuex mutation when created with user and order id", async () => {
      mocks.$route.params.id = testOrder.id;
      mutations = {
        Cart: {
          SET_CART_WITH_ORDER: jest.fn(),
        },
      };
      store = generateMockStore({ actions, mutations });
      setLoadData(store);
      setUser(store);
      setOrders(store);
      createComponent({ localVue, store, stubs, mocks });
      await flushPromises();
      expect(mutations.Cart.SET_CART_WITH_ORDER).toHaveBeenCalled();
    });

    it("sets state cart with order data when created with user and order id", async () => {
      mocks.$route.params.id = testOrder.id;
      setUser(store);
      setOrders(store);
      createComponent({ localVue, store, stubs, mocks });
      await flushPromises();
      const { delivery, phone, orderAddress, orderPizzas, orderMisc } =
        store.state.Cart;
      const parsedPizzas = Pizza.parseItems(testOrder.orderPizzas);
      expect(delivery).toBe(testOrder.id);
      expect(phone).toBe(testOrder.phone);
      expect(orderAddress).toEqual(testOrder.orderAddress);
      expect(orderPizzas).toEqual(parsedPizzas);
      expect(orderMisc).toEqual(testOrder.orderMisc);
    });
  });

  describe("when confirm delete pizza", () => {
    it("shows confirm popup when cart pizzas emit deletePizza", async () => {
      setCart(store);
      createComponent({ localVue, store, stubs, mocks });
      await flushPromises();
      findPizzas().at(0).vm.$emit("deletePizza", testCartPizza.id);
      await nextTick();
      expect(findConfirmPopup().exists()).toBe(true);
      expect(findConfirmPopup().text()).toContain(
        `Удалить пиццу ${testCartPizza.name}?`
      );
    });

    it("closes confirm popup when it emits cancel", async () => {
      setCart(store);
      createComponent({ localVue, store, stubs, mocks });
      await flushPromises();
      await showConfirmPopup();
      const confirmPopup = findConfirmPopup();
      confirmPopup.vm.$emit("cancel");
      await nextTick();
      expect(confirmPopup.exists()).toBe(false);
    });

    it("calls vuex action when confirm popup emits confirm", async () => {
      setCart(store);
      createComponent({ localVue, store, stubs, mocks });
      await flushPromises();
      await showConfirmPopup();
      findConfirmPopup().vm.$emit("confirm");
      await nextTick();
      expect(actions.Cart.deletePizza).toHaveBeenCalled();
    });

    it("closes confirm popup when it emits confirm", async () => {
      setCart(store);
      createComponent({ localVue, store, stubs, mocks });
      await flushPromises();
      await showConfirmPopup();
      const confirmPopup = findConfirmPopup();
      confirmPopup.vm.$emit("confirm");
      await nextTick();
      expect(confirmPopup.exists()).toBe(false);
    });
  });

  describe("when submit", () => {
    it("calls vuex action to create order on submit", async () => {
      setCart(store);
      createComponent({ localVue, store, stubs, mocks });
      await flushPromises();
      await triggerSubmit();
      expect(actions.Orders.createOrder).toHaveBeenCalled();
    });

    it("calls vuex mutation to reset cart on submit success", async () => {
      mutations = {
        Cart: {
          RESET_CART: jest.fn(),
        },
      };
      store = generateMockStore({ actions, mutations });
      setLoadData(store);
      setCart(store);
      createComponent({ localVue, store, stubs, mocks });
      await flushPromises();
      await triggerSubmit();
      await nextTick();
      expect(mutations.Cart.RESET_CART).toHaveBeenCalled();
    });

    it("resets state cart on submit success", async () => {
      setCart(store);
      createComponent({ localVue, store, stubs, mocks });
      await flushPromises();
      await triggerSubmit();
      await nextTick();
      const { delivery, phone, orderPizzas, orderMisc, orderAddress } =
        store.state.Cart;
      expect(delivery).toBe(BASE_DELIVERIES[0].id);
      expect(phone).toBe("");
      expect(orderPizzas).toEqual([]);
      expect(orderMisc).toEqual([]);
      expect(orderAddress).toBe(null);
    });

    it("shows cart popup on submit success", async () => {
      setCart(store);
      createComponent({ localVue, store, stubs, mocks });
      await flushPromises();
      expect(findCartPopup().exists()).toBe(false);
      await triggerSubmit();
      expect(findCartPopup().exists()).toBe(true);
    });

    it("closes cart popup on close", async () => {
      setCart(store);
      createComponent({ localVue, store, stubs, mocks });
      await flushPromises();
      await triggerSubmit();
      const cartPopup = findCartPopup();
      cartPopup.vm.$emit("close");
      await nextTick();
      expect(cartPopup.exists()).toBe(false);
    });
  });

  describe("when leave cart route", () => {
    it("goes to orders route when cart popup transition emits leave if user exists", async () => {
      mocks.$route.params.id = testOrder.id;
      setUser(store);
      setOrders(store);
      createComponent({ localVue, store, stubs, mocks });
      await flushPromises();
      await triggerSubmit();
      findCartPopupTransition().vm.$emit("leave");
      expect(mocks.$router.push).toHaveBeenCalledWith("/orders");
    });

    it("goes to root route when cart popup transition emits leave when no user", async () => {
      setCart(store);
      createComponent({ localVue, store, stubs, mocks });
      await flushPromises();
      await triggerSubmit();
      findCartPopupTransition().vm.$emit("leave");
      expect(mocks.$router.push).toHaveBeenCalledWith("/");
    });
  });
});
