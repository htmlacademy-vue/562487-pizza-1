import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuex from "vuex";
import flushPromises from "flush-promises";
import { nextTick } from "vue";
import { generateMockStore } from "@/store/mocks";
import Profile from "../Profile";
import { setUIComponents } from "@/plugins/ui";
import { setUser, setUserAddresses, testAddress } from "@/store/mocks/setters";

const localVue = createLocalVue();
localVue.use(Vuex);
setUIComponents(localVue);

describe("Profile", () => {
  const mocks = {
    $notifier: {
      success: jest.fn(),
    },
  };
  let actions;
  let store;
  let wrapper;
  const createComponent = (options) => {
    wrapper = shallowMount(Profile, options);
  };

  const findProfileUser = () => wrapper.findComponent({ name: "ProfileUser" });
  const findAddressForm = () =>
    wrapper.findComponent({ name: "ProfileAddressForm" });
  const findAllCards = () =>
    wrapper.findAllComponents({ name: "ProfileAddressCard" });
  const findAddressCard = () =>
    wrapper.findComponent({ name: "ProfileAddressCard" });
  const findConfirmPopup = () =>
    wrapper.findComponent({ name: "ConfirmPopup" });
  const findOpenBtn = () => wrapper.find("[data-test='button-open'");

  const showAddForm = async () => {
    findOpenBtn().vm.$emit("click");
    await nextTick();
  };

  const showEditForm = async () => {
    findAddressCard().vm.$emit("edit", testAddress.id);
    await nextTick();
  };

  const showConfirmPopup = async () => {
    await showEditForm();
    findAddressForm().vm.$emit("deleteAddress");
    await nextTick();
  };

  beforeEach(() => {
    mocks.$notifier.success = jest.fn();
    actions = {
      Auth: {
        queryAddresses: jest.fn(() => Promise.resolve()),
        deleteAddress: jest.fn(() => Promise.resolve()),
      },
    };
    store = generateMockStore({ actions });
    setUser(store);
    setUserAddresses(store);
  });

  afterEach(() => {
    wrapper.destroy();
  });

  describe("profile view", () => {
    it("renders out profile view", async () => {
      createComponent({ localVue, store, mocks });
      await flushPromises();
      expect(wrapper.exists()).toBe(true);
    });

    it("calls vuex action when created", async () => {
      createComponent({ localVue, store });
      await flushPromises();
      expect(actions.Auth.queryAddresses).toHaveBeenCalled();
    });

    it("renders out profile user if user exists", async () => {
      createComponent({ localVue, store, mocks });
      await flushPromises();
      expect(findProfileUser().exists()).toBe(true);
    });

    it("renders out addresses", async () => {
      createComponent({ localVue, store, mocks });
      await flushPromises();
      const stateAddresses = store.state.Auth.addresses;
      expect(findAllCards().length).toBe(stateAddresses.length);
    });

    it("renders out open button", async () => {
      createComponent({ localVue, store, mocks });
      await flushPromises();
      expect(findOpenBtn().exists()).toBe(true);
    });

    it("does not render out address form", async () => {
      createComponent({ localVue, store, mocks });
      await flushPromises();
      expect(findAddressForm().exists()).toBe(false);
    });

    it("does not render out confirm popup", async () => {
      createComponent({ localVue, store, mocks });
      await flushPromises();
      expect(findConfirmPopup().exists()).toBe(false);
    });
  });

  describe("new address form", () => {
    it("opens new address form on open button click", async () => {
      createComponent({ localVue, store, mocks });
      await flushPromises();
      findOpenBtn().vm.$emit("click");
      await nextTick();
      const addressForm = findAddressForm();
      expect(addressForm.exists()).toBe(true);
      expect(addressForm.props("isEditMode")).toBe(false);
      expect(addressForm.props("addressToEdit")).toBe(null);
    });

    it("closes address form when it emits close", async () => {
      createComponent({ localVue, store, mocks });
      await flushPromises();
      await showAddForm();
      const addressForm = findAddressForm();
      addressForm.vm.$emit("close");
      await nextTick();
      expect(addressForm.exists()).toBe(false);
    });
  });

  describe("edit address form", () => {
    it("opens edit form when address card emits edit", async () => {
      createComponent({ localVue, store, mocks });
      await flushPromises();
      findAddressCard().vm.$emit("edit", testAddress.id);
      await nextTick();
      const addressForm = findAddressForm();
      expect(addressForm.exists()).toBe(true);
      expect(addressForm.props("isEditMode")).toBe(true);
      expect(addressForm.props("addressToEdit")).toBe(testAddress.id);
    });
  });

  describe("confirm delete address", () => {
    it("opens confirm popup when edit address form emits deleteAddress", async () => {
      createComponent({ localVue, store, mocks });
      await flushPromises();
      await showEditForm();
      findAddressForm().vm.$emit("deleteAddress");
      await nextTick();
      expect(findConfirmPopup().exists()).toBe(true);
    });

    it("closes confirm popup when it emits cancel", async () => {
      createComponent({ localVue, store, mocks });
      await flushPromises();
      await showConfirmPopup();
      const popup = findConfirmPopup();
      popup.vm.$emit("cancel");
      await nextTick();
      expect(popup.exists()).toBe(false);
    });

    it("calls vuex action when confirm popup emits confirm", async () => {
      createComponent({ localVue, store, mocks });
      await flushPromises();
      await showConfirmPopup();
      findConfirmPopup().vm.$emit("confirm");
      await nextTick();
      expect(actions.Auth.deleteAddress).toHaveBeenCalled();
    });

    it("calls notifier success when delete order success", async () => {
      createComponent({ localVue, store, mocks });
      await flushPromises();
      await showConfirmPopup();
      findConfirmPopup().vm.$emit("confirm");
      await nextTick();
      await nextTick();
      const message = `Адрес ${testAddress.id} успешно удалён`;
      expect(mocks.$notifier.success).toHaveBeenCalledWith(message);
    });

    it("closes popup when delete order success", async () => {
      createComponent({ localVue, store, mocks });
      await flushPromises();
      await showConfirmPopup();
      const popup = findConfirmPopup();
      popup.vm.$emit("confirm");
      await nextTick();
      await nextTick();
      expect(popup.exists()).toBe(false);
    });

    it("does not close popup when delete order error", async () => {
      actions.Auth.deleteAddress = jest.fn(() => Promise.reject());
      store = generateMockStore({ actions });
      setUser(store);
      setUserAddresses(store);
      createComponent({ localVue, store, mocks });
      await flushPromises();
      await showConfirmPopup();
      const popup = findConfirmPopup();
      popup.vm.$emit("confirm");
      await nextTick();
      await nextTick();
      expect(popup.exists()).toBe(true);
    });

    it("closes address form when delete order success", async () => {
      createComponent({ localVue, store, mocks });
      await flushPromises();
      await showConfirmPopup();
      findConfirmPopup().vm.$emit("confirm");
      await nextTick();
      await nextTick();
      expect(findAddressForm().exists()).toBe(false);
    });

    it("does not close address form when delete order error", async () => {
      actions.Auth.deleteAddress = jest.fn(() => Promise.reject());
      store = generateMockStore({ actions });
      setUser(store);
      setUserAddresses(store);
      createComponent({ localVue, store, mocks });
      await flushPromises();
      await showConfirmPopup();
      findConfirmPopup().vm.$emit("confirm");
      await nextTick();
      await nextTick();
      expect(findAddressForm().exists()).toBe(true);
    });
  });
});
