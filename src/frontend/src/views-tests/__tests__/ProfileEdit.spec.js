import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuex from "vuex";
import flushPromises from "flush-promises";
import { nextTick } from "vue";
import { generateMockStore } from "@/store/mocks";
import ProfileEdit from "@/views/profile/^edit/_id";
import { setUIComponents } from "@/plugins/ui";
import { setUser, setUserAddresses, testAddress } from "@/store/mocks/setters";

const localVue = createLocalVue();
localVue.use(Vuex);
setUIComponents(localVue);

describe("ProfileEdit", () => {
  const mocks = {
    $route: {
      params: {
        id: `${testAddress.id}`,
      },
    },
    $router: {
      push: jest.fn(),
    },
    $notifier: {
      success: jest.fn(),
    },
  };
  let actions;
  let store;
  let wrapper;
  const createComponent = (options) => {
    wrapper = shallowMount(ProfileEdit, options);
  };

  const findAddressForm = () =>
    wrapper.findComponent({ name: "ProfileAddressForm" });
  const findConfirmPopup = () =>
    wrapper.findComponent({ name: "ConfirmPopup" });

  const showConfirmPopup = async () => {
    findAddressForm().vm.$emit("delete");
    await nextTick();
  };

  const submitForm = async () => {
    findAddressForm().vm.$emit("save", testAddress);
    await nextTick();
  };

  beforeEach(() => {
    mocks.$router.push = jest.fn();
    mocks.$notifier.success = jest.fn();
    actions = {
      Auth: {
        updateAddress: jest.fn(() => Promise.resolve()),
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

  describe("profile edit view", () => {
    it("renders out profile edit", async () => {
      createComponent({ localVue, store, mocks });
      expect(wrapper.exists()).toBe(true);
    });

    it("does not render out confirm popup", async () => {
      createComponent({ localVue, store, mocks });
      await flushPromises();
      expect(findConfirmPopup().exists()).toBe(false);
    });

    it("renders out form in edit mode", async () => {
      createComponent({ localVue, store, mocks });
      const addressForm = findAddressForm();
      expect(addressForm.exists()).toBe(true);
      expect(addressForm.props().isEditMode).toBe(true);
      expect(addressForm.props().isDeleting).toBe(false);
      expect(addressForm.props().isSubmitting).toBe(false);
    });
  });

  describe("confirm delete address", () => {
    it("shows confirm popup when form emits delete", async () => {
      createComponent({ localVue, store, mocks });
      findAddressForm().vm.$emit("delete");
      await nextTick();
      expect(findConfirmPopup().exists()).toBe(true);
    });

    it("closes confirm popup when it emits cancel", async () => {
      createComponent({ localVue, store, mocks });
      await showConfirmPopup();
      const popup = findConfirmPopup();
      popup.vm.$emit("cancel");
      await nextTick();
      expect(popup.exists()).toBe(false);
    });

    it("sets isDeleting to true when confirm popup emits confirm", async () => {
      createComponent({ localVue, store, mocks });
      await showConfirmPopup();
      findConfirmPopup().vm.$emit("confirm");
      await nextTick();
      expect(findAddressForm().props().isDeleting).toBe(true);
    });

    it("calls vuex action when confirm popup emits confirm", async () => {
      createComponent({ localVue, store, mocks });
      await showConfirmPopup();
      findConfirmPopup().vm.$emit("confirm");
      await nextTick();
      expect(actions.Auth.deleteAddress).toHaveBeenCalled();
    });

    it("calls notifier success when delete order success", async () => {
      createComponent({ localVue, store, mocks });
      await showConfirmPopup();
      findConfirmPopup().vm.$emit("confirm");
      await nextTick();
      await nextTick();
      const message = `Адрес ${testAddress.id} успешно удалён`;
      expect(mocks.$notifier.success).toHaveBeenCalledWith(message);
    });

    it("closes popup when delete order success", async () => {
      createComponent({ localVue, store, mocks });
      await showConfirmPopup();
      const popup = findConfirmPopup();
      popup.vm.$emit("confirm");
      await nextTick();
      await nextTick();
      expect(popup.exists()).toBe(false);
    });

    it("goes to profile route when delete order success", async () => {
      createComponent({ localVue, store, mocks });
      await showConfirmPopup();
      findConfirmPopup().vm.$emit("confirm");
      await nextTick();
      await nextTick();
      expect(mocks.$router.push).toHaveBeenCalledWith("/profile");
    });

    it("does not close popup when delete order error", async () => {
      actions.Auth.deleteAddress = jest.fn(() => Promise.reject());
      store = generateMockStore({ actions });
      setUser(store);
      setUserAddresses(store);
      createComponent({ localVue, store, mocks });
      await showConfirmPopup();
      const popup = findConfirmPopup();
      popup.vm.$emit("confirm");
      await nextTick();
      await nextTick();
      expect(popup.exists()).toBe(true);
    });

    it("does not close address form when delete order error", async () => {
      actions.Auth.deleteAddress = jest.fn(() => Promise.reject());
      store = generateMockStore({ actions });
      setUser(store);
      setUserAddresses(store);
      createComponent({ localVue, store, mocks });
      await showConfirmPopup();
      findConfirmPopup().vm.$emit("confirm");
      await nextTick();
      await nextTick();
      expect(findAddressForm().props().isDeleting).toBe(false);
      expect(mocks.$router.push).not.toHaveBeenCalled();
    });
  });

  describe("when submit", () => {
    it("sets isSubmitting to true when form emits save", async () => {
      createComponent({ localVue, store, mocks });
      const form = findAddressForm();
      form.vm.$emit("save", testAddress);
      await nextTick();
      expect(form.props().isSubmitting).toBe(true);
    });

    it("calls vuex action to create address when form emits save", async () => {
      createComponent({ localVue, store, mocks });
      await submitForm();
      expect(actions.Auth.updateAddress).toHaveBeenCalled();
    });

    it("calls notifier success when submit success", async () => {
      createComponent({ localVue, store, mocks });
      await submitForm();
      await nextTick();
      expect(mocks.$notifier.success).toHaveBeenCalledWith(
        `Адрес ${testAddress.id} успешно обновлён`
      );
    });

    it("goes to profile route when submit success", async () => {
      createComponent({ localVue, store, mocks });
      await submitForm();
      await nextTick();
      expect(mocks.$router.push).toHaveBeenCalledWith("/profile");
    });

    it("does not close address form when submit error", async () => {
      actions = {
        Auth: {
          updateAddress: jest.fn(() => Promise.reject()),
        },
      };
      store = generateMockStore({ actions });
      setUser(store);
      setUserAddresses(store);
      createComponent({ localVue, store, mocks });
      const form = findAddressForm();
      form.vm.$emit("save", testAddress);
      await nextTick();
      await nextTick();
      expect(form.props().isSubmitting).toBe(false);
      expect(form.exists()).toBe(true);
    });
  });
});
