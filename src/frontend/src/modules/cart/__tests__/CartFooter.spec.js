import { createLocalVue, shallowMount } from "@vue/test-utils";
import CartFooter from "../components/CartFooter";
import { setUIComponents } from "@/plugins/ui";

const localVue = createLocalVue();
setUIComponents(localVue);

describe("CartFooter", () => {
  const propsData = {
    isSubmitDisabled: true,
    totalSum: 500,
  };
  const stubs = ["router-link"];
  let wrapper;
  const createComponent = (options) => {
    wrapper = shallowMount(CartFooter, options);
  };

  const findOneMoreBtn = () => wrapper.find("[data-test='one-more-btn']");
  const findFooterPrice = () => wrapper.find("[data-test='footer-price']");
  const findSubmit = () => wrapper.find("[type=submit]");

  afterEach(() => {
    wrapper.destroy();
  });

  it("renders out cart footer", () => {
    createComponent({ localVue, stubs, propsData });
    expect(wrapper.exists()).toBe(true);
  });

  it("renders out router link to root route", () => {
    createComponent({ localVue, stubs, propsData });
    expect(findOneMoreBtn().attributes().to).toBe("/");
  });

  it("renders out cart total price with prop totalSum", () => {
    createComponent({ localVue, stubs, propsData });
    expect(findFooterPrice().text()).toBe(`Итого: ${propsData.totalSum} ₽`);
  });

  it("renders out submit button", () => {
    createComponent({ localVue, stubs, propsData });
    expect(findSubmit().exists()).toBe(true);
  });

  it("renders out submit button disabled when prop isSubmitDisabled equals true", () => {
    createComponent({ localVue, stubs, propsData });
    expect(findSubmit().attributes().disabled).toBeTruthy();
  });

  it("renders out submit button not disabled when prop isSubmitDisabled equals false", () => {
    createComponent({
      localVue,
      stubs,
      propsData: {
        ...propsData,
        isSubmitDisabled: false,
      },
    });
    expect(findSubmit().attributes().disabled).toBeFalsy();
  });
});
