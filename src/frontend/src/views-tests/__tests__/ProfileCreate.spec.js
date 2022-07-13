import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuex from "vuex";
import { nextTick } from "vue";
import { generateMockStore } from "@/store/mocks";
import ProfileCreate from "@/views/profile/^create";
import { setUIComponents } from "@/plugins/ui";
import { setUser, setUserAddresses, testAddress } from "@/store/mocks/setters";

const localVue = createLocalVue();
localVue.use(Vuex);
setUIComponents(localVue);

describe("ProfileCreate", () => {
  const mocks = {
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
    wrapper = shallowMount(ProfileCreate, options);
  };

  const findAddressForm = () =>
    wrapper.findComponent({ name: "ProfileAddressForm" });

  const submitForm = async () => {
    findAddressForm().vm.$emit("save", testAddress);
    await nextTick();
  };

  beforeEach(() => {
    mocks.$router.push = jest.fn();
    mocks.$notifier.success = jest.fn();
    actions = {
      Auth: {
        createNewAddress: jest.fn(() =>
          Promise.resolve({ id: testAddress.id })
        ),
      },
    };
    store = generateMockStore({ actions });
    setUser(store);
    setUserAddresses(store);
  });

  afterEach(() => {
    wrapper.destroy();
  });

  it("renders out address form", async () => {
    createComponent({ localVue, store, mocks });
    expect(wrapper.exists()).toBe(true);
    expect(findAddressForm().exists()).toBe(true);
  });

  it("goes to profile route when form emits delete", async () => {
    createComponent({ localVue, store, mocks });
    findAddressForm().vm.$emit("delete");
    await nextTick();
    expect(mocks.$router.push).toHaveBeenCalledWith("/profile");
  });

  it("sets isSubmitting to true when form emits save", async () => {
    createComponent({ localVue, store, mocks });
    const form = findAddressForm();
    await submitForm();
    expect(form.props().isSubmitting).toBe(true);
  });

  it("calls vuex action to create address when form emits save", async () => {
    createComponent({ localVue, store, mocks });
    await submitForm();
    expect(actions.Auth.createNewAddress).toHaveBeenCalled();
  });

  it("calls notifier success when submit success", async () => {
    createComponent({ localVue, store, mocks });
    await submitForm();
    await nextTick();
    expect(mocks.$notifier.success).toHaveBeenCalledWith(
      `Адрес ${testAddress.id} успешно создан`
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
        createNewAddress: jest.fn(() => Promise.reject()),
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
