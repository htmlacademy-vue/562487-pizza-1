import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuex from "vuex";
import { nextTick } from "vue";
import flushPromises from "flush-promises";
import { generateMockStore } from "@/store/mocks";
import Orders from "@/views/Orders";
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

  const findAllCards = () => wrapper.findAllComponents({ name: "OrderCard" });
  const findCard = () => wrapper.findComponent({ name: "OrderCard" });
  const findConfirmPopup = () =>
    wrapper.findComponent({ name: "ConfirmPopup" });

  const showConfirmPopup = async () => {
    findCard().vm.$emit("deleteOrder", testOrder.id);
    await nextTick();
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
    store = generateMockStore({ actions });
  });

  afterEach(() => {
    wrapper.destroy();
  });

  describe("orders view", () => {
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
      expect(findAllCards().length).toBe(1);
    });

    it("does not render out confirm popup", async () => {
      setOrders(store);
      createComponent({ localVue, store });
      await flushPromises();
      expect(findConfirmPopup().exists()).toBe(false);
    });
  });

  describe("confirm delete order", () => {
    it("shows confirm popup when order card emits deleteOrder", async () => {
      setOrders(store);
      createComponent({ localVue, store });
      await flushPromises();
      findCard().vm.$emit("deleteOrder", testOrder.id);
      await nextTick();
      const confirmPopup = findConfirmPopup();
      expect(confirmPopup.exists()).toBe(true);
      expect(confirmPopup.text()).toContain(`Удалить заказ #${testOrder.id}?`);
    });

    it("close confirm popup when it emits cancel", async () => {
      setOrders(store);
      createComponent({ localVue, store });
      await flushPromises();
      await showConfirmPopup();
      const confirmPopup = findConfirmPopup();
      confirmPopup.vm.$emit("cancel");
      await nextTick();
      expect(confirmPopup.exists()).toBe(false);
    });

    it("calls vuex action when confirm popup emits confirm", async () => {
      setOrders(store);
      createComponent({ localVue, store, mocks });
      await showConfirmPopup();
      findConfirmPopup().vm.$emit("confirm");
      expect(actions.Orders.deleteOrder).toHaveBeenCalled();
    });

    it("calls notifier success when delete success", async () => {
      setOrders(store);
      createComponent({ localVue, store, mocks });
      await flushPromises();
      await showConfirmPopup();
      findConfirmPopup().vm.$emit("confirm");
      await nextTick();
      await nextTick();
      expect(mocks.$notifier.success).toHaveBeenCalledWith(
        `Заказ ${testOrder.id} успешно удалён`
      );
    });

    it("closes confirm popup when delete success", async () => {
      setOrders(store);
      createComponent({ localVue, store, mocks });
      await flushPromises();
      await showConfirmPopup();
      const confirmPopup = findConfirmPopup();
      confirmPopup.vm.$emit("confirm");
      await nextTick();
      await nextTick();
      expect(confirmPopup.exists()).toBe(false);
    });

    it("does not close confirm popup when delete error", async () => {
      actions.Orders.deleteOrder = jest.fn(() => Promise.reject());
      store = generateMockStore({ actions });
      setOrders(store);
      createComponent({ localVue, store, mocks });
      await flushPromises();
      await showConfirmPopup();
      const confirmPopup = findConfirmPopup();
      confirmPopup.vm.$emit("confirm");
      await nextTick();
      await nextTick();
      expect(confirmPopup.exists()).toBe(true);
    });
  });
});
