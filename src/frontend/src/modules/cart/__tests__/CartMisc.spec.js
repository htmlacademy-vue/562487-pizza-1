import { createLocalVue, mount } from "@vue/test-utils";
import Vuex from "vuex";
import { generateMockStore } from "@/store/mocks";
import CartMisc from "../components/CartMisc";
import ItemCounter from "@/common/components/ItemCounter";
import { setMisc, setOrderMisc, testMisc } from "@/store/mocks/setters";
import { setUIComponents } from "@/plugins/ui";

const localVue = createLocalVue();
localVue.use(Vuex);
setUIComponents(localVue);

describe("CartMisc", () => {
  const orderMiscItem = {
    miscId: 1,
    quantity: 2,
  };

  let store;
  let wrapper;
  const createComponent = (options) => {
    wrapper = mount(CartMisc, options);
  };

  beforeEach(() => {
    store = generateMockStore();
    setMisc(store);
    setOrderMisc(store, [orderMiscItem]);
  });

  afterEach(() => {
    wrapper.destroy();
  });

  it("renders out prop misc", () => {
    createComponent({ localVue, store });
    const miscItems = wrapper.findAll("[data-test='misc-item']");
    expect(wrapper.exists()).toBe(true);
    expect(miscItems.length).toBe(testMisc.length);
  });

  it("displays misc item description", () => {
    createComponent({ localVue, store });
    const { image, name } = testMisc[0];
    const miscDescription = wrapper.find("[data-test='misc-description']");
    const miscImage = miscDescription.find("img");
    expect(miscImage.attributes().src).toBe(image);
    expect(miscImage.attributes().alt).toBe(name);
    expect(miscDescription.text()).toContain(name);
  });

  it("calls vuex mutation on ItemCounter incrementClick", () => {
    createComponent({ localVue, store });
    const spyOnUpdate = jest.spyOn(wrapper.vm, "updateOrderMisc");
    const itemCounter = wrapper.findComponent(ItemCounter);
    itemCounter.vm.$emit("incrementClick");
    expect(spyOnUpdate).toHaveBeenCalledWith({
      miscId: orderMiscItem.miscId,
      quantity: orderMiscItem.quantity + 1,
    });
  });

  it("calls vuex mutation on ItemCounter decrementClick", () => {
    createComponent({ localVue, store });
    const spyOnUpdate = jest.spyOn(wrapper.vm, "updateOrderMisc");
    const itemCounter = wrapper.findComponent(ItemCounter);
    itemCounter.vm.$emit("decrementClick");
    expect(spyOnUpdate).toHaveBeenCalledWith({
      miscId: orderMiscItem.miscId,
      quantity: orderMiscItem.quantity - 1,
    });
  });

  it("displays misc item price", () => {
    createComponent({ localVue, store });
    const { miscId, price } = testMisc[0];
    const miscPriceItem = wrapper.find("[data-test='misc-price']");
    const quantity =
      store.state.Cart.orderMisc.find((it) => it.miscId === miscId)?.quantity ||
      0;
    const miscPrice = price * quantity;
    expect(miscPriceItem.text()).toContain(miscPrice);
  });
});
