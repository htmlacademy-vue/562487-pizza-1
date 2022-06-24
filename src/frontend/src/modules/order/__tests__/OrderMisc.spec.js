import { createLocalVue, mount } from "@vue/test-utils";
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
    wrapper = mount(OrderMisc, options);
  };

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
    const image = wrapper.find("img");
    expect(image.attributes().src).toBe(miscItem.image);
    expect(image.attributes().alt).toBe(miscItem.name);
  });

  it("renders out order misc name", () => {
    createComponent({ localVue, store, propsData });
    const miscName = wrapper.find("[data-test='misc-name']");
    expect(miscName.text()).toBe(miscItem.name);
  });

  it("renders out order misc price", () => {
    createComponent({ localVue, store, propsData });
    const miscPrice = wrapper.find("[data-test='misc-price']");
    expect(miscPrice.text()).toBe(
      `${propsData.orderMisc.quantity} х ${miscItem.price} ₽`
    );
  });
});
