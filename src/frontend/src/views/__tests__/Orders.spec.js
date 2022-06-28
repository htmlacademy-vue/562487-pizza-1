import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuex from "vuex";
import { nextTick } from "vue";
import flushPromises from "flush-promises";
import { generateMockStore } from "@/store/mocks";
import Orders from "../Orders";
import { setUIComponents } from "@/plugins/ui";
import { setOrders, testOrder } from "@/store/mocks/setters";

const localVue = createLocalVue();
localVue.use(Vuex);
setUIComponents(localVue);

describe("Orders", () => {
  let mocks;
  let actions;
  let store;
  let wrapper;
  const createComponent = (options) => {
    wrapper = shallowMount(Orders, options);
  };

  beforeEach(() => {
    mocks = {
      $notifier: {
        success: jest.fn(),
      },
    };
    actions = {
      Orders: {
        queryOrders: jest.fn(() => Promise.resolve()),
        deleteOrder: jest.fn(() => Promise.resolve()),
      },
    };
    store = generateMockStore(actions);
  });

  afterEach(() => {
    wrapper.destroy();
  });

  it("renders out orders view", async () => {
    createComponent({ localVue, store });
    await flushPromises();
    expect(wrapper.exists()).toBe(true);
  });

  it("calls vuex action when created", async () => {
    createComponent({ localVue, store });
    await flushPromises();
    expect(actions.Orders.queryOrders).toHaveBeenCalled();
  });

  it("renders out orders cards", async () => {
    setOrders(store);
    createComponent({ localVue, store });
    await flushPromises();
    const ordersCards = wrapper.findAllComponents({ name: "OrderCard" });
    expect(ordersCards.length).toBe(1);
  });

  it("does not render out confirm popup", async () => {
    setOrders(store);
    createComponent({ localVue, store });
    await flushPromises();
    expect(wrapper.vm.isConfirmPopupShowed).toBe(false);
    const confirmPopup = wrapper.findComponent({ name: "ConfirmPopup" });
    expect(confirmPopup.exists()).toBe(false);
  });

  it("renders out confirm popup when isConfirmPopupShowed,", async () => {
    setOrders(store);
    createComponent({ localVue, store });
    await flushPromises();
    await wrapper.setData({
      isConfirmPopupShowed: true,
      orderIdToDelete: testOrder.id,
    });
    const confirmPopup = wrapper.findComponent({ name: "ConfirmPopup" });
    expect(confirmPopup.exists()).toBe(true);
    expect(confirmPopup.text()).toContain(`Удалить заказ #${testOrder.id}?`);
  });

  it("shows confirm popup when order card emits deleteOrder", async () => {
    setOrders(store);
    createComponent({ localVue, store });
    await flushPromises();
    const orderCard = wrapper.findComponent({ name: "OrderCard" });
    expect(wrapper.vm.isConfirmPopupShowed).toBe(false);
    orderCard.vm.$emit("deleteOrder", testOrder.id);
    await nextTick();
    expect(wrapper.vm.isConfirmPopupShowed).toBe(true);
    expect(wrapper.vm.orderIdToDelete).toBe(testOrder.id);
  });

  it("close confirm popup when it emits cancel", async () => {
    setOrders(store);
    createComponent({ localVue, store });
    await flushPromises();
    await wrapper.setData({
      isConfirmPopupShowed: true,
      orderIdToDelete: testOrder.id,
    });
    const confirmPopup = wrapper.findComponent({ name: "ConfirmPopup" });
    confirmPopup.vm.$emit("cancel");
    await nextTick();
    expect(wrapper.vm.isConfirmPopupShowed).toBe(false);
  });

  it("calls vuex action when confirm popup emits confirm", async () => {
    setOrders(store);
    createComponent({ localVue, store, mocks });
    const spyOnDelete = jest.spyOn(wrapper.vm, "deleteOrder");
    await flushPromises();
    await wrapper.setData({
      isConfirmPopupShowed: true,
      orderIdToDelete: testOrder.id,
    });
    const confirmPopup = wrapper.findComponent({ name: "ConfirmPopup" });
    confirmPopup.vm.$emit("confirm");
    expect(spyOnDelete).toHaveBeenCalledWith(testOrder.id);
  });

  it("calls notifier success when delete success", async () => {
    setOrders(store);
    createComponent({ localVue, store, mocks });
    await flushPromises();
    await wrapper.setData({
      isConfirmPopupShowed: true,
      orderIdToDelete: testOrder.id,
    });
    const confirmPopup = wrapper.findComponent({ name: "ConfirmPopup" });
    confirmPopup.vm.$emit("confirm");
    await nextTick();
    await nextTick();
    expect(mocks.$notifier.success).toHaveBeenCalledWith(
      `Заказ ${testOrder.id} успешно удалён`
    );
  });

  it("close confirm popup when delete success", async () => {
    setOrders(store);
    createComponent({ localVue, store, mocks });
    await flushPromises();
    await wrapper.setData({
      isConfirmPopupShowed: true,
      orderIdToDelete: testOrder.id,
    });
    const confirmPopup = wrapper.findComponent({ name: "ConfirmPopup" });
    confirmPopup.vm.$emit("confirm");
    await nextTick();
    await nextTick();
    expect(wrapper.vm.isConfirmPopupShowed).toBe(false);
  });

  it("set isSubmitting to false on delete error", async () => {
    actions.Orders.deleteOrder = jest.fn(() => Promise.reject());
    store = generateMockStore(actions);
    setOrders(store);
    createComponent({ localVue, store, mocks });
    await flushPromises();
    await wrapper.setData({
      isConfirmPopupShowed: true,
      orderIdToDelete: testOrder.id,
    });
    const confirmPopup = wrapper.findComponent({ name: "ConfirmPopup" });
    confirmPopup.vm.$emit("confirm");
    expect(wrapper.vm.isSubmitting).toBe(true);
    await nextTick();
    await nextTick();
    expect(wrapper.vm.isSubmitting).toBe(false);
  });
});
