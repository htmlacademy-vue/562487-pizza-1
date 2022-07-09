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
  const mocks = {
    $router: {
      push: jest.fn(),
    },
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

  beforeEach(() => {
    mocks.$router.push = jest.fn();
  });

  afterEach(() => {
    wrapper.destroy();
  });

  it("renders out profile address card", () => {
    createComponent({ localVue, mocks, propsData });
    expect(wrapper.exists()).toBe(true);
  });

  it("displays prop address name", () => {
    createComponent({ localVue, mocks, propsData });
    const { id, name } = propsData.address;
    const addressName = findAddressName();
    expect(addressName.exists()).toBe(true);
    expect(addressName.text()).toBe(`Адрес №${id}. ${name}`);
  });

  it("renders out edit button", () => {
    createComponent({ localVue, mocks, propsData });
    const editBtn = findEditBtn();
    expect(editBtn.exists()).toBe(true);
    expect(findEditBtn().text()).toBe("Изменить адрес");
  });

  it("goes to profile edit route on edit button click", async () => {
    createComponent({ localVue, mocks, propsData });
    findEditBtn().trigger("click");
    await nextTick();
    expect(mocks.$router.push).toHaveBeenCalledWith(
      "/profile/edit/" + testAddress.id
    );
  });

  it("displays address info", () => {
    const { street, building, flat } = propsData.address;
    const addressString = `${street}, д. ${building}, кв. ${flat}`;
    createComponent({ localVue, propsData, mocks });
    expect(findAddressInfo().text()).toBe(addressString);
  });

  it("displays address comment", () => {
    createComponent({ localVue, mocks, propsData });
    const addressComment = findAddressComment();
    expect(addressComment.exists()).toBe(true);
    expect(addressComment.text()).toBe(testAddress.comment);
  });

  it("does not display address comment", async () => {
    createComponent({
      localVue,
      mocks,
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
