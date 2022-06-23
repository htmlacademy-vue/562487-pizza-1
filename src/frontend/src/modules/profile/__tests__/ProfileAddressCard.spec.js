import { createLocalVue, mount } from "@vue/test-utils";
import Vuex from "vuex";
import ProfileAddressCard from "../components/ProfileAddressCard";
import { setUIComponents } from "@/plugins/ui";
import { testAddress } from "@/store/mocks/setters";

const localVue = createLocalVue();
localVue.use(Vuex);
setUIComponents(localVue);

describe("ProfileAddressCard", () => {
  const propsData = {
    address: testAddress,
    isEditDisabled: false,
  };
  let wrapper;
  const createComponent = (options) => {
    wrapper = mount(ProfileAddressCard, options);
  };

  afterEach(() => {
    wrapper.destroy();
  });

  it("renders out profile address card", () => {
    createComponent({ localVue, propsData });
    expect(wrapper.exists()).toBe(true);
  });

  it("displays address name", () => {
    createComponent({ localVue, propsData });
    const nameEl = wrapper.find("[data-test='address-name']");
    expect(nameEl.text()).toContain(testAddress.id);
    expect(nameEl.text()).toContain(testAddress.name);
  });

  it("renders out edit button not disabled", () => {
    createComponent({ localVue, propsData });
    const btn = wrapper.find("[data-test='button-edit']");
    expect(btn.element.disabled).toBe(false);
    expect(btn.text()).toBe("Изменить адрес");
  });

  it("edit button is disabled when prop isEditDisabled", () => {
    createComponent({
      localVue,
      propsData: { ...propsData, isEditDisabled: true },
    });
    const btn = wrapper.find("[data-test='button-edit']");
    expect(btn.element.disabled).toBe(true);
  });

  it("emits edit on edit button click", async () => {
    createComponent({ localVue, propsData });
    const btn = wrapper.find("[data-test='button-edit']");
    await btn.trigger("click");
    expect(wrapper.emitted().edit).toBeTruthy();
    expect(wrapper.emitted().edit[0][0]).toBe(testAddress.id);
  });

  it("displays address info", () => {
    const { street, building, flat } = testAddress;
    const addressString = `${street}, д. ${building}, кв. ${flat}`;
    createComponent({ localVue, propsData });
    const addressInfo = wrapper.find("[data-test='address-info']");
    expect(addressInfo.text()).toBe(addressString);
  });

  it("displays address comment", () => {
    createComponent({ localVue, propsData });
    const addressComment = wrapper.find("[data-test='address-comment']");
    expect(addressComment.exists()).toBe(true);
    expect(addressComment.text()).toBe(testAddress.comment);
  });

  it("does not display address comment", async () => {
    createComponent({
      localVue,
      propsData: {
        isEditDisabled: false,
        address: {
          ...testAddress,
          comment: "",
        },
      },
    });
    const addressComment = wrapper.find("[data-test='address-comment']");
    expect(addressComment.exists()).toBe(false);
  });
});
