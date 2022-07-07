import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuex from "vuex";
import { nextTick } from "vue";
import { generateMockStore } from "@/store/mocks";
import CartMiscItem from "../components/CartMiscItem";
import { setUIComponents } from "@/plugins/ui";
import {
  setMisc,
  testMisc,
  setCart,
  testCartMisc,
} from "@/store/mocks/setters";

const localVue = createLocalVue();
localVue.use(Vuex);
setUIComponents(localVue);

describe("CartMiscItem", () => {
  const propsData = {
    item: testMisc.find((it) => it.miscId === testCartMisc.miscId),
  };
  let mutations;
  let store;
  let wrapper;
  const createComponent = (options) => {
    wrapper = shallowMount(CartMiscItem, options);
  };

  const findDescription = () => wrapper.find("[data-test='misc-description']");
  const findImage = () => wrapper.find("[data-test='misc-description'] img");
  const findItemCounter = () => wrapper.findComponent({ name: "ItemCounter" });
  const findMiscPrice = () => wrapper.find("[data-test='misc-price']");

  beforeEach(() => {
    store = generateMockStore();
    setMisc(store);
    setCart(store);
  });

  afterEach(() => {
    wrapper.destroy();
  });

  describe("misc item", () => {
    it("renders out misc item", () => {
      createComponent({ localVue, store, propsData });
      expect(wrapper.exists()).toBe(true);
    });

    it("renders out misc description", () => {
      createComponent({ localVue, store, propsData });
      expect(findDescription().exists()).toBe(true);
      expect(findDescription().text()).toContain(propsData.item.name);
    });

    it("renders out misc image", () => {
      createComponent({ localVue, store, propsData });
      const { image, name } = propsData.item;
      const miscImage = findImage();
      expect(miscImage.exists()).toBe(true);
      expect(miscImage.attributes().src).toBe(image);
      expect(miscImage.attributes().alt).toBe(name);
    });

    it("renders out item counter", () => {
      createComponent({ localVue, store, propsData });
      expect(findItemCounter().exists()).toBe(true);
    });

    it("renders out misc price", () => {
      createComponent({ localVue, store, propsData });
      const { price, miscId } = propsData.item;
      const quantity = store.getters["Cart/orderMiscQuantityById"](miscId);
      const miscSum = price * quantity;
      const miscPrice = findMiscPrice();
      expect(miscPrice.exists()).toBe(true);
      expect(miscPrice.text()).toBe(`× ${miscSum} ₽`);
    });
  });

  describe("item counter events", () => {
    it("calls vuex mutation when item counter emits incrementClick", async () => {
      mutations = {
        Cart: {
          UPDATE_CART_ORDER_MISC: jest.fn(),
        },
      };
      store = generateMockStore({ mutations });
      setMisc(store);
      setCart(store);
      createComponent({ localVue, store, propsData });
      findItemCounter().vm.$emit("incrementClick");
      await nextTick();
      expect(mutations.Cart.UPDATE_CART_ORDER_MISC).toHaveBeenCalled();
    });

    it("adds misc item when item counter emits incrementClick", async () => {
      createComponent({ localVue, store, propsData });
      expect(store.state.Cart.orderMisc[0].miscId).toBe(propsData.item.miscId);
      expect(store.state.Cart.orderMisc[0].quantity).toBe(1);
      findItemCounter().vm.$emit("incrementClick");
      await nextTick();
      expect(store.state.Cart.orderMisc[0].miscId).toBe(propsData.item.miscId);
      expect(store.state.Cart.orderMisc[0].quantity).toBe(2);
    });

    it("calls vuex mutation when item counter emits decrementClick", async () => {
      mutations = {
        Cart: {
          UPDATE_CART_ORDER_MISC: jest.fn(),
        },
      };
      store = generateMockStore({ mutations });
      setMisc(store);
      setCart(store);
      createComponent({ localVue, store, propsData });
      findItemCounter().vm.$emit("decrementClick");
      await nextTick();
      expect(mutations.Cart.UPDATE_CART_ORDER_MISC).toHaveBeenCalled();
    });

    it("removes misc item when item counter emits decrementClick", async () => {
      createComponent({ localVue, store, propsData });
      expect(store.state.Cart.orderMisc[0].miscId).toBe(propsData.item.miscId);
      expect(store.state.Cart.orderMisc[0].quantity).toBe(1);
      findItemCounter().vm.$emit("decrementClick");
      await nextTick();
      expect(store.state.Cart.orderMisc.length).toBe(0);
    });
  });
});
