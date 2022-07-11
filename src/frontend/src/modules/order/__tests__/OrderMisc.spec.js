import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuex from "vuex";
import { generateMockStore } from "@/store/mocks";
import OrderMisc from "../components/OrderMisc";
import { setUIComponents } from "@/plugins/ui";
import { setMisc, testMisc } from "@/store/mocks/setters";

const localVue = createLocalVue();
localVue.use(Vuex);
setUIComponents(localVue);

describe("OrderMisc", () => {
  const propsData = {
    orderMisc: {
      miscId: 1,
      quantity: 1,
    },
  };
  const miscItem = testMisc.find(
    (it) => it.miscId === propsData.orderMisc.miscId
  );
  let store;
  let wrapper;
  const createComponent = (options) => {
    wrapper = shallowMount(OrderMisc, options);
  };

  const findImage = () => wrapper.find("img");
  const findMiscName = () => wrapper.find("[data-test='misc-name']");
  const findMiscPrice = () => wrapper.find("[data-test='misc-price']");

  beforeEach(() => {
    store = generateMockStore();
    setMisc(store);
  });

  afterEach(() => {
    wrapper.destroy();
  });

  it("renders out order misc", () => {
    createComponent({ localVue, store, propsData });
    expect(wrapper.exists()).toBe(true);
  });

  it("renders out order misc image", () => {
    createComponent({ localVue, store, propsData });
    const image = findImage();
    expect(image.exists()).toBe(true);
    expect(image.attributes().src).toBe(miscItem.image);
    expect(image.attributes().alt).toBe(miscItem.name);
  });

  it("renders out order misc name", () => {
    createComponent({ localVue, store, propsData });
    const miscName = findMiscName();
    expect(miscName.exists()).toBe(true);
    expect(miscName.text()).toBe(miscItem.name);
  });

  it("renders out order misc quantity and price if quantity > 1", () => {
    const miscItemQuantity = 2;
    createComponent({
      localVue,
      store,
      propsData: {
        orderMisc: { ...propsData.orderMisc, quantity: miscItemQuantity },
      },
    });
    const miscPrice = findMiscPrice();
    expect(miscPrice.exists()).toBe(true);
    expect(miscPrice.text()).toBe(`${miscItemQuantity} х ${miscItem.price} ₽`);
  });

  it("renders out order misc price if quantity = 1", () => {
    createComponent({ localVue, store, propsData });
    const miscPrice = findMiscPrice();
    expect(miscPrice.exists()).toBe(true);
    expect(miscPrice.text()).toBe(`${miscItem.price} ₽`);
  });
});
