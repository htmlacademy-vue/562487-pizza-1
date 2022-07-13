import { createLocalVue, mount } from "@vue/test-utils";
import Vuex from "vuex";
import { nextTick } from "vue";
import { generateMockStore } from "@/store/mocks";
import ProfileAddressForm from "../components/ProfileAddressForm";
import { setUIComponents } from "@/plugins/ui";
import { setUser, setUserAddresses, testAddress } from "@/store/mocks/setters";
import { Address } from "@/common/models";

const localVue = createLocalVue();
localVue.use(Vuex);
setUIComponents(localVue);

describe("ProfileAddressForm", () => {
  const newAddressId = 1;

  const propsData = {
    isSubmitting: false,
  };

  const editPropsData = {
    isEditMode: true,
    isDeleting: false,
    isSubmitting: false,
  };

  const addressData = new Address({
    name: "New Address",
    street: "Baker street",
    building: "1",
    flat: "",
    comment: "",
  });

  const mocks = {
    $route: {
      params: {
        id: testAddress.id,
      },
    },
    $notifier: {
      success: jest.fn(),
    },
  };

  let actions;
  let store;
  let wrapper;

  const createComponent = (options) => {
    wrapper = mount(ProfileAddressForm, options);
  };

  const triggerSubmit = async () => {
    findForm().trigger("submit");
    await nextTick();
  };

  const findTitle = () => wrapper.find("[data-test='form-title']");
  const findNameInput = () => wrapper.find("[data-test='address-name'] input");
  const findStreetInput = () =>
    wrapper.find("[data-test='address-street'] input");
  const findBuildingInput = () =>
    wrapper.find("[data-test='address-building'] input");
  const findFlatInput = () => wrapper.find("[data-test='address-flat'] input");
  const findCommentInput = () =>
    wrapper.find("[data-test='address-comment'] input");
  const findDelete = () => wrapper.find("[data-test='btn-delete']");
  const findSubmit = () => wrapper.find("[type='submit']");
  const findForm = () => wrapper.find("form");

  const fillInput = async (findFn, value) => {
    const input = findFn();
    input.element.value = value;
    input.trigger("input");
    await nextTick();
  };

  const fillForm = async () => {
    await fillInput(findNameInput, addressData.name);
    await fillInput(findStreetInput, addressData.street);
    await fillInput(findBuildingInput, addressData.building);
  };

  beforeEach(() => {
    mocks.$notifier.success = jest.fn();
    actions = {
      Auth: {
        createNewAddress: jest.fn(() => Promise.resolve({ id: newAddressId })),
        updateAddress: jest.fn(() => Promise.resolve()),
      },
    };
    store = generateMockStore({ actions });
    setUser(store);
    setUserAddresses(store);
  });

  afterEach(() => {
    wrapper.destroy();
  });

  describe("when add mode", () => {
    it("renders out add form", () => {
      createComponent({ localVue, store, mocks, propsData });
      expect(wrapper.exists()).toBe(true);
      expect(findTitle().text()).toBe("Новый адрес");
      expect(findNameInput().element.value).toBe("");
      expect(findStreetInput().element.value).toBe("");
      expect(findBuildingInput().element.value).toBe("");
      expect(findFlatInput().element.value).toBe("");
      expect(findCommentInput().element.value).toBe("");
    });

    it("emits save on add form submit", async () => {
      createComponent({ localVue, store, mocks, propsData });
      await fillForm();
      await triggerSubmit();
      expect(wrapper.emitted().save).toBeTruthy();
      const submitData = wrapper.emitted().save[0][0];
      expect(submitData.name).toBe(addressData.name);
      expect(submitData.street).toBe(addressData.street);
      expect(submitData.building).toBe(addressData.building);
    });
  });

  describe("when edit mode", () => {
    it("renders out edit form", () => {
      createComponent({
        localVue,
        store,
        mocks,
        propsData: { ...editPropsData },
      });
      expect(wrapper.exists()).toBe(true);
      expect(findTitle().text()).toBe("Редактировать адрес");
      expect(findNameInput().element.value).toBe(testAddress.name);
      expect(findStreetInput().element.value).toBe(testAddress.street);
      expect(findBuildingInput().element.value).toBe(testAddress.building);
      expect(findFlatInput().element.value).toBe(testAddress.flat);
      expect(findCommentInput().element.value).toBe(testAddress.comment);
    });

    it("emits save on edit form submit", async () => {
      createComponent({
        localVue,
        store,
        mocks,
        propsData: { ...editPropsData },
      });
      await triggerSubmit();
      expect(wrapper.emitted().save[0][0]).toEqual(testAddress);
    });
  });

  describe("both add and edit modes", () => {
    it("renders out form with name input focused", () => {
      const div = document.createElement("div");
      div.id = "root";
      document.body.appendChild(div);
      createComponent({ localVue, store, mocks, propsData, attachTo: "#root" });
      const focusedInput = wrapper.find("input:focus");
      expect(focusedInput.exists()).toBe(true);
      expect(focusedInput.attributes().name).toBe("addr-name");
    });

    it("submit button not disabled when required fields are not empty", async () => {
      createComponent({ localVue, store, mocks, propsData });
      await fillForm();
      expect(findSubmit().element.disabled).toBe(false);
    });

    it("submit button disabled when name field is empty", async () => {
      createComponent({ localVue, store, mocks, propsData });
      await fillForm();
      await fillInput(findNameInput, "");
      expect(findSubmit().element.disabled).toBe(true);
    });

    it("submit button disabled when street field is empty", async () => {
      createComponent({ localVue, store, mocks, propsData });
      await fillForm();
      await fillInput(findStreetInput, "");
      expect(findSubmit().element.disabled).toBe(true);
    });

    it("submit button disabled when building field is empty", async () => {
      createComponent({ localVue, store, mocks, propsData });
      await fillForm();
      await fillInput(findBuildingInput, "");
      expect(findSubmit().element.disabled).toBe(true);
    });

    it("submit button disabled when prop isSubmitting", async () => {
      createComponent({
        localVue,
        store,
        mocks,
        propsData: {
          ...propsData,
          isSubmitting: true,
        },
      });
      expect(findSubmit().element.disabled).toBe(true);
    });

    it("does not render out delete button when prop isSubmitting", async () => {
      createComponent({
        localVue,
        store,
        mocks,
        propsData: {
          ...propsData,
          isSubmitting: true,
        },
      });
      expect(findDelete().exists()).toBe(false);
    });

    it("buttons are disabled when prop isDeleting", async () => {
      createComponent({
        localVue,
        store,
        mocks,
        propsData: { ...editPropsData, isDeleting: true },
      });
      expect(findDelete().element.disabled).toBe(true);
      expect(findSubmit().element.disabled).toBe(true);
    });

    it("emits delete on delete button click", async () => {
      createComponent({ localVue, store, mocks, propsData });
      await findDelete().trigger("click");
      expect(wrapper.emitted().delete).toBeTruthy();
    });
  });
});
