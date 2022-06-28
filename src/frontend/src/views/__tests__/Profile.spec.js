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

  beforeEach(() => {
    mocks.$notifier.success = jest.fn();
    actions = {
      Auth: {
        queryAddresses: jest.fn(() => Promise.resolve()),
        deleteAddress: jest.fn(() => Promise.resolve()),
      },
    };
    store = generateMockStore(actions);
    setUser(store);
    setUserAddresses(store);
  });

  afterEach(() => {
    wrapper.destroy();
  });

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
    const profileUser = wrapper.findComponent({ name: "ProfileUser" });
    expect(profileUser.exists()).toBe(true);
  });

  it("renders out addresses", async () => {
    createComponent({ localVue, store, mocks });
    await flushPromises();
    const addresses = wrapper.findAllComponents({ name: "ProfileAddressCard" });
    const stateAddresses = store.state.Auth.addresses;
    expect(addresses.length).toBe(stateAddresses.length);
  });

  it("does not render out address form", async () => {
    createComponent({ localVue, store, mocks });
    await flushPromises();
    const addressForm = wrapper.findComponent({ name: "ProfileAddressForm" });
    expect(addressForm.exists()).toBe(false);
  });

  it("renders out address form when isFormShowed", async () => {
    createComponent({ localVue, store, mocks });
    await flushPromises();
    await wrapper.setData({
      isFormShowed: true,
    });
    const addressForm = wrapper.findComponent({ name: "ProfileAddressForm" });
    expect(addressForm.exists()).toBe(true);
  });

  it("renders out open form button", async () => {
    createComponent({ localVue, store, mocks });
    await flushPromises();
    const openButton = wrapper.find("[data-test='button-open'");
    expect(openButton.exists()).toBe(true);
  });

  it("does not render out confirm popup", async () => {
    createComponent({ localVue, store, mocks });
    await flushPromises();
    const popup = wrapper.findComponent({ name: "ConfirmPopup" });
    expect(popup.exists()).toBe(false);
  });

  it("renders out confirm popup when isConfirmPopupShowed", async () => {
    createComponent({ localVue, store, mocks });
    await flushPromises();
    await wrapper.setData({
      isConfirmPopupShowed: true,
      addressToEdit: testAddress.id,
    });
    const popup = wrapper.findComponent({ name: "ConfirmPopup" });
    expect(popup.exists()).toBe(true);
    expect(popup.text()).toContain(`Удалить адрес #${testAddress.id}?`);
  });

  it("opens edit form when address card emits edit", async () => {
    createComponent({ localVue, store, mocks });
    await flushPromises();
    const addressCard = wrapper.findComponent({ name: "ProfileAddressCard" });
    expect(wrapper.vm.isFormShowed).toBe(false);
    expect(wrapper.vm.isEditMode).toBe(false);
    expect(wrapper.vm.addressToEdit).toBe(null);
    addressCard.vm.$emit("edit", testAddress.id);
    expect(wrapper.vm.isFormShowed).toBe(true);
    expect(wrapper.vm.isEditMode).toBe(true);
    expect(wrapper.vm.addressToEdit).toBe(testAddress.id);
  });

  it("opens new address form on open button click", async () => {
    createComponent({ localVue, store, mocks });
    await flushPromises();
    const openButton = wrapper.find("[data-test='button-open'");
    openButton.vm.$emit("click");
    await nextTick();
    expect(wrapper.vm.isFormShowed).toBe(true);
    expect(wrapper.vm.isEditMode).toBe(false);
  });

  it("closes address form when it emits close", async () => {
    createComponent({ localVue, store, mocks });
    await flushPromises();
    await wrapper.setData({
      isFormShowed: true,
      isEditMode: false,
    });
    const addressForm = wrapper.findComponent({ name: "ProfileAddressForm" });
    addressForm.vm.$emit("close");
    await nextTick();
    expect(wrapper.vm.isFormShowed).toBe(false);
    expect(wrapper.vm.isEditMode).toBe(false);
    expect(wrapper.vm.addressToEdit).toBe(null);
  });

  it("opens confirm popup when edit address form emits deleteAddress", async () => {
    createComponent({ localVue, store, mocks });
    await flushPromises();
    await wrapper.setData({
      isFormShowed: true,
      addressToEdit: testAddress.id,
    });
    const addressForm = wrapper.findComponent({ name: "ProfileAddressForm" });
    addressForm.vm.$emit("deleteAddress");
    await nextTick();
    expect(wrapper.vm.isConfirmPopupShowed).toBe(true);
  });

  it("closes confirm popup when it emits cancel", async () => {
    createComponent({ localVue, store, mocks });
    await flushPromises();
    await wrapper.setData({
      isConfirmPopupShowed: true,
      addressToEdit: testAddress.id,
      isEditMode: true,
    });
    const popup = wrapper.findComponent({ name: "ConfirmPopup" });
    popup.vm.$emit("cancel");
    await nextTick();
    expect(wrapper.vm.isConfirmPopupShowed).toBe(false);
  });

  // confirm delete
  it("calls vuex action when confirm popup it emits confirm", async () => {
    createComponent({ localVue, store, mocks });
    const spyOnDeleteAddress = jest.spyOn(wrapper.vm, "deleteAddress");
    await flushPromises();
    await wrapper.setData({
      isConfirmPopupShowed: true,
      addressToEdit: testAddress.id,
      isFormShowed: true,
      isEditMode: true,
    });
    const popup = wrapper.findComponent({ name: "ConfirmPopup" });
    popup.vm.$emit("confirm");
    await nextTick();
    expect(spyOnDeleteAddress).toHaveBeenCalledWith(testAddress.id);
  });

  it("calls notifier success when delete order success", async () => {
    createComponent({ localVue, store, mocks });
    await flushPromises();
    await wrapper.setData({
      isConfirmPopupShowed: true,
      addressToEdit: testAddress.id,
      isFormShowed: true,
      isEditMode: true,
    });
    const popup = wrapper.findComponent({ name: "ConfirmPopup" });
    popup.vm.$emit("confirm");
    await nextTick();
    await nextTick();
    const message = `Адрес ${testAddress.id} успешно удалён`;
    expect(mocks.$notifier.success).toHaveBeenCalledWith(message);
  });

  it("closes popup when delete order success", async () => {
    createComponent({ localVue, store, mocks });
    await flushPromises();
    await wrapper.setData({
      isConfirmPopupShowed: true,
      addressToEdit: testAddress.id,
      isFormShowed: true,
      isEditMode: true,
    });
    const popup = wrapper.findComponent({ name: "ConfirmPopup" });
    popup.vm.$emit("confirm");
    await nextTick();
    await nextTick();
    expect(wrapper.vm.isConfirmPopupShowed).toBe(false);
  });

  it("closes address form when delete order success", async () => {
    createComponent({ localVue, store, mocks });
    await flushPromises();
    await wrapper.setData({
      isConfirmPopupShowed: true,
      addressToEdit: testAddress.id,
      isFormShowed: true,
      isEditMode: true,
    });
    const popup = wrapper.findComponent({ name: "ConfirmPopup" });
    popup.vm.$emit("confirm");
    await nextTick();
    await nextTick();
    expect(wrapper.vm.isFormShowed).toBe(false);
    expect(wrapper.vm.isEditMode).toBe(false);
  });

  it("sets isDeleting to false when delete order error", async () => {
    actions.Auth.deleteAddress = jest.fn(() => Promise.reject());
    store = generateMockStore(actions);
    createComponent({ localVue, store, mocks });
    await flushPromises();
    await wrapper.setData({
      isConfirmPopupShowed: true,
      addressToEdit: testAddress.id,
      isFormShowed: true,
      isEditMode: true,
    });
    const popup = wrapper.findComponent({ name: "ConfirmPopup" });
    popup.vm.$emit("confirm");
    expect(wrapper.vm.isDeleting).toBe(true);
    await nextTick();
    await nextTick();
    expect(wrapper.vm.isDeleting).toBe(false);
  });
});
