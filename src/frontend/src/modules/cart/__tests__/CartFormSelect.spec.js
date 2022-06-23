import { createLocalVue, mount } from "@vue/test-utils";
import Vuex from "vuex";
import { generateMockStore } from "@/store/mocks";
import CartFormSelect from "../components/CartFormSelect";
import { setUIComponents } from "@/plugins/ui";
import { BASE_DELIVERIES } from "@/common/constants";
import { Address } from "@/common/models";
import {
  setDelivery,
  setCartAddress,
  setUserAddresses,
  testAddress,
} from "@/store/mocks/setters";

const localVue = createLocalVue();
localVue.use(Vuex);
setUIComponents(localVue);

describe("CartFormSelect", () => {
  let store;
  let wrapper;
  const createComponent = (options) => {
    wrapper = mount(CartFormSelect, options);
  };

  beforeEach(() => {
    store = generateMockStore();
  });

  afterEach(() => {
    wrapper.destroy();
  });

  it("renders out cart form select", () => {
    createComponent({ localVue, store });
    expect(wrapper.exists()).toBe(true);
    const select = wrapper.find("[data-test='delivery-select']");
    expect(select.exists()).toBe(true);
  });

  it("select has 2 basic options", () => {
    createComponent({ localVue, store });
    const options = wrapper.findAll("option");
    expect(options.length).toBe(2);
    expect(options.at(0).text()).toBe(BASE_DELIVERIES[0].name);
    expect(options.at(1).text()).toBe(BASE_DELIVERIES[1].name);
  });

  it("select has 3 options", () => {
    setUserAddresses(store);
    createComponent({ localVue, store });
    const options = wrapper.findAll("option");
    expect(options.length).toBe(3);
    expect(options.at(0).text()).toBe(BASE_DELIVERIES[0].name);
    expect(options.at(1).text()).toBe(BASE_DELIVERIES[1].name);
    expect(options.at(2).text()).toBe(testAddress.name);
  });

  it("select value is cart state delivery", () => {
    setDelivery(store, BASE_DELIVERIES[1].id);
    createComponent({ localVue, store });
    const select = wrapper.find("[data-test='delivery-select']");
    expect(select.element.value).toBe(BASE_DELIVERIES[1].id);
  });

  it("set delivery with new address when created with not user's orderAddress", () => {
    const notUserOrderAddress = new Address({
      ...testAddress,
      userId: null,
      id: "100",
    });
    setCartAddress(store, notUserOrderAddress);
    createComponent({ localVue, store });
    const { delivery, orderAddress } = store.state.Cart;
    expect(delivery).toBe(BASE_DELIVERIES[1].id);
    expect(orderAddress).toEqual({
      street: notUserOrderAddress.street,
      building: notUserOrderAddress.building,
      flat: notUserOrderAddress.flat,
    });
  });

  it("calls mutations on select change to pickup delivery", async () => {
    setDelivery(store, BASE_DELIVERIES[1].id);
    createComponent({ localVue, store });
    const spyOnMutation = jest.spyOn(wrapper.vm, "setCartEntity");
    const select = wrapper.find("[data-test='delivery-select']");
    select.element.value = BASE_DELIVERIES[0].id;
    await select.trigger("change");
    expect(spyOnMutation).toHaveBeenCalledWith({
      entity: "delivery",
      value: BASE_DELIVERIES[0].id,
    });
    expect(spyOnMutation).toHaveBeenCalledWith({
      entity: "orderAddress",
      value: null,
    });
  });

  it("calls mutations on select change to new address", async () => {
    createComponent({ localVue, store });
    const spyOnMutation = jest.spyOn(wrapper.vm, "setCartEntity");
    const select = wrapper.find("[data-test='delivery-select']");
    select.element.value = BASE_DELIVERIES[1].id;
    await select.trigger("change");
    expect(spyOnMutation).toHaveBeenCalledWith({
      entity: "delivery",
      value: BASE_DELIVERIES[1].id,
    });
    expect(spyOnMutation).toHaveBeenCalledWith({
      entity: "orderAddress",
      value: {
        street: "",
        building: "",
        flat: "",
      },
    });
  });

  it("calls mutations on select change to user address", async () => {
    setUserAddresses(store);
    createComponent({ localVue, store });
    const spyOnMutation = jest.spyOn(wrapper.vm, "setCartEntity");
    const select = wrapper.find("[data-test='delivery-select']");
    select.element.value = testAddress.id;
    await select.trigger("change");
    expect(spyOnMutation).toHaveBeenCalledWith({
      entity: "delivery",
      value: `${testAddress.id}`,
    });
    expect(spyOnMutation).toHaveBeenCalledWith({
      entity: "orderAddress",
      value: testAddress,
    });
  });
});
