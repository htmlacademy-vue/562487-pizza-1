import { createLocalVue, mount } from "@vue/test-utils";
import Vuex from "vuex";
import { generateMockStore } from "@/store/mocks";
import CartFormPhone from "../components/CartFormPhone";
import { setUIComponents } from "@/plugins/ui";

const localVue = createLocalVue();
localVue.use(Vuex);
setUIComponents(localVue);

describe("CartFormPhone", () => {
  const cartPhone = "88000000000";
  let store;
  let wrapper;
  const createComponent = (options) => {
    wrapper = mount(CartFormPhone, options);
  };

  beforeEach(() => {
    store = generateMockStore();
    store.commit("Cart/SET_CART_ENTITY", {
      entity: "phone",
      value: cartPhone,
    });
  });

  afterEach(() => {
    wrapper.destroy();
  });

  it("renders out phone input", () => {
    createComponent({ localVue, store });
    expect(wrapper.exists()).toBe(true);
  });

  it("phone input value is cart state phone", () => {
    createComponent({ localVue, store });
    const phoneInput = wrapper.find("input");
    expect(phoneInput.element.value).toBe(cartPhone);
  });

  it("call vuex mutation setCartEntity on phone input", async () => {
    const newPhone = "88002000600";
    createComponent({ localVue, store });
    const spyOnMutation = jest.spyOn(wrapper.vm, "setCartEntity");
    const phoneInput = wrapper.find("input");
    phoneInput.element.value = newPhone;
    await phoneInput.trigger("input");
    expect(spyOnMutation).toHaveBeenCalledWith({
      entity: "phone",
      value: newPhone,
    });
  });
});
