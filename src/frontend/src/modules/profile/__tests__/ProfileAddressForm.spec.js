import { createLocalVue, mount } from "@vue/test-utils";
import Vuex from "vuex";
import { nextTick } from "vue";
import { generateMockStore } from "@/store/mocks";
import ProfileAddressForm from "../components/ProfileAddressForm";
import { setUIComponents } from "@/plugins/ui";
import {
  setUser,
  setUserAddresses,
  testUser,
  testAddress,
} from "@/store/mocks/setters";
import { Address } from "@/common/models";

const localVue = createLocalVue();
localVue.use(Vuex);
setUIComponents(localVue);

describe("ProfileAddressForm", () => {
  const newAddressId = 1;
  const propsData = {
    isEditMode: false,
    isDeleting: false,
  };

  const addressData = new Address({
    name: "New Address",
    street: "Baker street",
    building: "1",
    flat: "",
    comment: "",
  });

  const mocks = {
    $notifier: {
      success: jest.fn(),
    },
  };

  let actions;
  let store;
  let wrapper;
  const createAddComponent = async (options) => {
    wrapper = mount(ProfileAddressForm, { localVue, propsData, ...options });
    await wrapper.setData({
      address: addressData,
      isSubmitting: false,
    });
  };
  const createEditComponent = (options) => {
    wrapper = mount(ProfileAddressForm, {
      localVue,
      propsData: {
        isDeleting: false,
        isEditMode: true,
        addressToEdit: testAddress.id,
      },
      ...options,
    });
  };

  beforeEach(() => {
    mocks.$notifier.success = jest.fn();
    actions = {
      Auth: {
        createNewAddress: jest.fn(() => Promise.resolve({ id: newAddressId })),
        updateAddress: jest.fn(() => Promise.resolve()),
      },
    };
    store = generateMockStore(actions);
    setUser(store);
    setUserAddresses(store);
  });

  afterEach(() => {
    wrapper.destroy();
  });

  it("renders out profile add new address form", () => {
    wrapper = mount(ProfileAddressForm, { localVue, store, propsData });
    expect(wrapper.exists()).toBe(true);
    const formTitle = wrapper.find("[data-test='form-title']");
    expect(formTitle.text()).toBe("Новый адрес");
    expect(wrapper.vm.address.name).toBe("");
    expect(wrapper.vm.address.street).toBe("");
    expect(wrapper.vm.address.building).toBe("");
    expect(wrapper.vm.address.flat).toBe("");
    expect(wrapper.vm.address.comment).toBe("");
  });

  it("renders out profile edit address form", () => {
    createEditComponent({ store });
    expect(wrapper.exists()).toBe(true);
    const formTitle = wrapper.find("[data-test='form-title']");
    expect(formTitle.text()).toBe("Редактировать адрес");
    expect(wrapper.vm.address.name).toBe(testAddress.name);
    expect(wrapper.vm.address.street).toBe(testAddress.street);
    expect(wrapper.vm.address.building).toBe(testAddress.building);
    expect(wrapper.vm.address.flat).toBe(testAddress.flat);
    expect(wrapper.vm.address.comment).toBe(testAddress.comment);
  });

  it("renders out form with name input focused", () => {
    const div = document.createElement("div");
    div.id = "root";
    document.body.appendChild(div);
    wrapper = mount(ProfileAddressForm, {
      localVue,
      store,
      propsData,
      attachTo: "#root",
    });
    const focusedInput = wrapper.find("input:focus");
    expect(focusedInput.exists()).toBe(true);
    expect(focusedInput.attributes().name).toBe("addr-name");
  });

  it("buttons are disabled when prop isDeleting", async () => {
    await createAddComponent({
      store,
      propsData: { ...propsData, isDeleting: true },
    });
    const deleteBtn = wrapper.find("[data-test='btn-delete']");
    const submitBtn = wrapper.find("[type='submit']");
    expect(deleteBtn.element.disabled).toBe(true);
    expect(submitBtn.element.disabled).toBe(true);
  });

  it("buttons are disabled when data isSubmitting", async () => {
    await createAddComponent({ store });
    await wrapper.setData({ isSubmitting: true });
    const deleteBtn = wrapper.find("[data-test='btn-delete']");
    const submitBtn = wrapper.find("[type='submit']");
    expect(deleteBtn.element.disabled).toBe(true);
    expect(submitBtn.element.disabled).toBe(true);
  });

  it("emits close on delete button click when create new", async () => {
    await createAddComponent({ store });
    const deleteBtn = wrapper.find("[data-test='btn-delete']");
    await deleteBtn.trigger("click");
    expect(wrapper.emitted().close).toBeTruthy();
  });

  it("emits deleteAddress on delete button click when edit", async () => {
    createEditComponent({ store });
    const deleteBtn = wrapper.find("[data-test='btn-delete']");
    await deleteBtn.trigger("click");
    expect(wrapper.emitted().deleteAddress).toBeTruthy();
  });

  it("submit button not disabled when required fields are not empty", async () => {
    await createAddComponent({ store });
    const submitBtn = wrapper.find("[type='submit']");
    expect(submitBtn.element.disabled).toBe(false);
  });

  it("submit button disabled when name field is empty", async () => {
    await createAddComponent({ store });
    await wrapper.setData({ address: { ...addressData, name: "" } });
    const submitBtn = wrapper.find("[type='submit']");
    expect(submitBtn.element.disabled).toBe(true);
  });

  it("submit button disabled when street field is empty", async () => {
    await createAddComponent({ store });
    await wrapper.setData({ address: { ...addressData, street: "" } });
    const submitBtn = wrapper.find("[type='submit']");
    expect(submitBtn.element.disabled).toBe(true);
  });

  it("submit button disabled when building field is empty", async () => {
    await createAddComponent({ store });
    await wrapper.setData({ address: { ...addressData, building: "" } });
    const submitBtn = wrapper.find("[type='submit']");
    expect(submitBtn.element.disabled).toBe(true);
  });

  // submit method
  it("sets isSubmitting on submit to disable button during request", async () => {
    await createAddComponent({ store, mocks });
    await wrapper.find("form").trigger("submit.prevent");
    await nextTick();
    expect(wrapper.vm.isSubmitting).toBe(true);
  });

  // create new address
  it("calls vuex action to create new address on submit", async () => {
    await createAddComponent({ store, mocks });
    const spyOnAction = jest.spyOn(wrapper.vm, "createNewAddress");
    await wrapper.find("form").trigger("submit.prevent");
    await nextTick();
    expect(spyOnAction).toHaveBeenCalledWith({
      ...addressData.toRaw(),
      userId: testUser.id,
    });
  });

  it("calls notifier success method when submit success", async () => {
    await createAddComponent({ store, mocks });
    await wrapper.find("form").trigger("submit.prevent");
    await nextTick();
    expect(mocks.$notifier.success).toHaveBeenCalledWith(
      `Адрес ${newAddressId} успешно создан`
    );
  });

  it("emits close on submit success", async () => {
    await createAddComponent({ store, mocks });
    await wrapper.find("form").trigger("submit.prevent");
    await nextTick();
    expect(wrapper.emitted().close).toBeTruthy();
  });

  it("sets submit not disabled on submit error", async () => {
    actions = {
      Auth: {
        createNewAddress: jest.fn(() => Promise.reject()),
      },
    };
    store = generateMockStore(actions);
    setUser(store);
    setUserAddresses(store);
    await createAddComponent({ store, mocks });
    await wrapper.find("form").trigger("submit.prevent");
    expect(wrapper.vm.isSubmitting).toBe(true);
    await nextTick();
    expect(wrapper.vm.isSubmitting).toBe(false);
  });

  // update address
  it("calls vuex action to edit address on submit", async () => {
    createEditComponent({ store, mocks });
    const spyOnAction = jest.spyOn(wrapper.vm, "updateAddress");
    await wrapper.find("form").trigger("submit.prevent");
    await nextTick();
    expect(spyOnAction).toHaveBeenCalledWith({
      ...testAddress,
      userId: testUser.id,
    });
  });

  it("calls notifier success method when edit submit success", async () => {
    createEditComponent({ store, mocks });
    await wrapper.find("form").trigger("submit.prevent");
    await nextTick();
    expect(mocks.$notifier.success).toHaveBeenCalledWith(
      `Адрес ${newAddressId} успешно обновлён`
    );
  });

  it("emits close on edit submit success", async () => {
    createEditComponent({ store, mocks });
    await wrapper.find("form").trigger("submit.prevent");
    await nextTick();
    expect(wrapper.emitted().close).toBeTruthy();
  });

  it("sets submit not disabled on edit submit error", async () => {
    actions = {
      Auth: {
        updateAddress: jest.fn(() => Promise.reject()),
      },
    };
    store = generateMockStore(actions);
    setUser(store);
    setUserAddresses(store);
    createEditComponent({ store, mocks });
    await wrapper.find("form").trigger("submit.prevent");
    expect(wrapper.vm.isSubmitting).toBe(true);
    await nextTick();
    expect(wrapper.vm.isSubmitting).toBe(false);
  });
});
