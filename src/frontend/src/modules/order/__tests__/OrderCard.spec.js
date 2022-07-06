import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuex from "vuex";
import { nextTick } from "vue";
import { generateMockStore } from "@/store/mocks";
import OrderCard from "../components/OrderCard";
import { setUIComponents } from "@/plugins/ui";
import { setLoadData, testOrder } from "@/store/mocks/setters";

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
    wrapper = shallowMount(OrderCard, options);
  };

  const findOrderNumber = () => wrapper.find("[data-test='order-number']");
  const findOrderSum = () => wrapper.find("[data-test='order-sum']");
  const findDeleteBtn = () => wrapper.find("[data-test='button-delete']");
  const findRepeatBtn = () => wrapper.find("[data-test='button-repeat']");
  const findPizzas = () => wrapper.findAllComponents({ name: "OrderPizza" });
  const findMisc = () => wrapper.findAllComponents({ name: "OrderMisc" });
  const findOrderAddress = () => wrapper.find("[data-test='order-address']");

  beforeEach(() => {
    mocks.$router.push = jest.fn();
    store = generateMockStore();
    setLoadData(store);
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
    const orderNumber = findOrderNumber();
    expect(orderNumber.exists()).toBe(true);
    expect(orderNumber.text()).toBe(`Заказ #${testOrder.id}`);
  });

  it("renders out order total price", () => {
    createComponent({ localVue, mocks, store, propsData });
    const totalPrice = store.getters["Orders/totalPrice"](testOrder);
    expect(findOrderSum().text()).toBe(`Сумма заказа: ${totalPrice} ₽`);
  });

  it("emits deleteOrder on delete button click", async () => {
    createComponent({ localVue, mocks, store, propsData });
    findDeleteBtn().vm.$emit("click");
    await nextTick();
    expect(wrapper.emitted().deleteOrder).toBeTruthy();
    expect(wrapper.emitted().deleteOrder[0][0]).toBe(testOrder.id);
  });

  it("goes to cart route on repeat button click", async () => {
    createComponent({ localVue, mocks, store, propsData });
    findRepeatBtn().vm.$emit("click");
    await nextTick();
    expect(mocks.$router.push).toHaveBeenCalledWith({
      name: "Cart",
      params: {
        id: propsData.order.id,
      },
    });
  });

  it("renders out pizzas list", () => {
    createComponent({ localVue, mocks, store, propsData });
    expect(findPizzas().length).toBe(propsData.order.orderPizzas.length);
  });

  it("renders out order misc list", () => {
    createComponent({ localVue, mocks, store, propsData });
    expect(findMisc().length).toBe(propsData.order.orderMisc.length);
  });

  it("renders out order address when exists", () => {
    createComponent({ localVue, mocks, store, propsData });
    const address = findOrderAddress();
    expect(address.exists()).toBe(true);
    expect(address.text()).toContain(propsData.order.orderAddress.name);
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
    expect(findOrderAddress().exists()).toBe(false);
  });
});
