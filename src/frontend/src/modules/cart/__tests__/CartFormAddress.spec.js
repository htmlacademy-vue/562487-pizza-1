import { createLocalVue, mount } from "@vue/test-utils";
import Vuex from "vuex";
import { generateMockStore } from "@/store/mocks";
import CartFormAddress from "../components/CartFormAddress";
import { setUIComponents } from "@/plugins/ui";
import {
  setCartAddress,
  setUserAddresses,
  testAddress,
} from "@/store/mocks/setters";

const localVue = createLocalVue();
localVue.use(Vuex);
setUIComponents(localVue);

describe("CartFormAddress", () => {
  const cartAddress = {
    street: "Baker street",
    building: "1",
    flat: "1",
  };
  let store;
  let wrapper;
  const createComponent = (options) => {
    wrapper = mount(CartFormAddress, options);
  };

  beforeEach(() => {
    store = generateMockStore();
    setCartAddress(store, cartAddress);
  });

  afterEach(() => {
    wrapper.destroy();
  });

  it("renders out cart address form", () => {
    createComponent({ localVue, store });
    expect(wrapper.exists()).toBe(true);
  });

  it("street input value is cart state orderAddress street", () => {
    createComponent({ localVue, store });
    const input = wrapper.find("input[name='street']");
    expect(input.element.value).toBe(cartAddress.street);
  });

  it("building input value is cart state orderAddress building", () => {
    createComponent({ localVue, store });
    const input = wrapper.find("input[name='building']");
    expect(input.element.value).toBe(cartAddress.building);
  });

  it("flat input value is cart state orderAddress flat", () => {
    createComponent({ localVue, store });
    const input = wrapper.find("input[name='flat']");
    expect(input.element.value).toBe(cartAddress.flat);
  });

  it("call vuex mutation updateAddress on street input", () => {
    const newValue = "Water street";
    createComponent({ localVue, store });
    const spyOnMutation = jest.spyOn(wrapper.vm, "updateAddress");
    const input = wrapper.findComponent("[data-test='input-street']");
    input.vm.$emit("input", newValue);
    expect(spyOnMutation).toHaveBeenCalledWith({
      entity: "street",
      value: newValue,
    });
  });

  it("call vuex mutation updateAddress on building input", async () => {
    const newValue = "2";
    createComponent({ localVue, store });
    const spyOnMutation = jest.spyOn(wrapper.vm, "updateAddress");
    const input = wrapper.findComponent("[data-test='input-building']");
    input.vm.$emit("input", newValue);
    expect(spyOnMutation).toHaveBeenCalledWith({
      entity: "building",
      value: newValue,
    });
  });

  it("call vuex mutation updateAddress on flat input", async () => {
    const newValue = "2";
    createComponent({ localVue, store });
    const spyOnMutation = jest.spyOn(wrapper.vm, "updateAddress");
    const input = wrapper.findComponent("[data-test='input-flat']");
    input.vm.$emit("input", newValue);
    expect(spyOnMutation).toHaveBeenCalledWith({
      entity: "flat",
      value: newValue,
    });
  });

  it("inputs are readonly when state orderAddress is user address", () => {
    setUserAddresses(store);
    setCartAddress(store, testAddress);
    createComponent({ localVue, store });
    const input = wrapper.find("[data-test='input-flat'] input");
    expect(input.attributes().readonly).toBe("readonly");
  });
});
