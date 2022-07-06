import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuex from "vuex";
import { nextTick } from "vue";
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
    wrapper = shallowMount(ProfileAddressCard, options);
  };

  const findAddressName = () => wrapper.find("[data-test='address-name']");
  const findEditBtn = () => wrapper.find("[data-test='button-edit']");
  const findAddressInfo = () => wrapper.find("[data-test='address-info']");
  const findAddressComment = () =>
    wrapper.find("[data-test='address-comment']");

  afterEach(() => {
    wrapper.destroy();
  });

  it("renders out profile address card", () => {
    createComponent({ localVue, propsData });
    expect(wrapper.exists()).toBe(true);
  });

  it("displays prop address name", () => {
    createComponent({ localVue, propsData });
    const { id, name } = propsData.address;
    expect(findAddressName().text()).toBe(`Адрес №${id}. ${name}`);
  });

  it("renders out edit button not disabled", () => {
    createComponent({ localVue, propsData });
    const btn = findEditBtn();
    expect(btn.element.disabled).toBe(false);
    expect(btn.text()).toBe("Изменить адрес");
  });

  it("edit button is disabled when prop isEditDisabled", () => {
    createComponent({
      localVue,
      propsData: { ...propsData, isEditDisabled: true },
    });
    expect(findEditBtn().element.disabled).toBe(true);
  });

  it("emits edit on edit button click", async () => {
    createComponent({ localVue, propsData });
    findEditBtn().trigger("click");
    await nextTick();
    expect(wrapper.emitted().edit).toBeTruthy();
    expect(wrapper.emitted().edit[0][0]).toBe(propsData.address.id);
  });

  it("displays address info", () => {
    const { street, building, flat } = propsData.address;
    const addressString = `${street}, д. ${building}, кв. ${flat}`;
    createComponent({ localVue, propsData });
    expect(findAddressInfo().text()).toBe(addressString);
  });

  it("displays address comment", () => {
    createComponent({ localVue, propsData });
    const addressComment = findAddressComment();
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
    expect(findAddressComment().exists()).toBe(false);
  });
});
