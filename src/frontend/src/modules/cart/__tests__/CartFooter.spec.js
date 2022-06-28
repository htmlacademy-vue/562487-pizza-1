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

  afterEach(() => {
    wrapper.destroy();
  });

  it("renders out cart footer", () => {
    createComponent({ localVue, stubs, propsData });
    expect(wrapper.exists()).toBe(true);
  });

  it("renders out router link to root route", () => {
    createComponent({ localVue, stubs, propsData });
    const routerLink = wrapper.find("[data-test='one-more-btn']");
    expect(routerLink.attributes().to).toBe("/");
  });

  it("renders out cart total price with prop totalSum", () => {
    createComponent({ localVue, stubs, propsData });
    const footerPrice = wrapper.find("[data-test='footer-price']");
    expect(footerPrice.text()).toBe(`Итого: ${propsData.totalSum} ₽`);
  });

  it("renders out submit button", () => {
    createComponent({ localVue, stubs, propsData });
    const submitBtn = wrapper.find("[type=submit]");
    expect(submitBtn.exists()).toBe(true);
  });
});
