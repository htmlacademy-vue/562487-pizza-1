import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuex from "vuex";
import { nextTick } from "vue";
import { generateMockStore } from "@/store/mocks";
import CartFormSelect from "../components/CartFormSelect";
import { setUIComponents } from "@/plugins/ui";
import { BASE_DELIVERIES } from "@/common/constants";
import {
  setDelivery,
  setUserAddresses,
  testAddress,
  setCartAddress,
} from "@/store/mocks/setters";

const localVue = createLocalVue();
localVue.use(Vuex);
setUIComponents(localVue);

describe("CartFormSelect", () => {
  let actions;
  let store;
  let wrapper;
  const createComponent = (options) => {
    wrapper = shallowMount(CartFormSelect, options);
  };

  beforeEach(() => {
    store = generateMockStore();
  });

  afterEach(() => {
    wrapper.destroy();
  });

  const findSelect = () => wrapper.find("select");
  const findOptions = () => wrapper.findAll("option");

  describe("select", () => {
    it("renders out cart form select", () => {
      createComponent({ localVue, store });
      expect(wrapper.exists()).toBe(true);
      expect(findSelect().exists()).toBe(true);
    });

    it("renders out select with 2 basic options", () => {
      createComponent({ localVue, store });
      const options = findOptions();
      expect(options.length).toBe(2);
      expect(options.at(0).text()).toBe(BASE_DELIVERIES[0].name);
      expect(options.at(1).text()).toBe(BASE_DELIVERIES[1].name);
    });

    it("renders out select with 3 or more options when user addresses exist", () => {
      setUserAddresses(store);
      createComponent({ localVue, store });
      const options = findOptions();
      expect(options.length).toBe(3);
      expect(options.at(0).text()).toBe(BASE_DELIVERIES[0].name);
      expect(options.at(1).text()).toBe(BASE_DELIVERIES[1].name);
      expect(options.at(2).text()).toBe(testAddress.name);
    });

    it("select value is cart state delivery", () => {
      setDelivery(store, BASE_DELIVERIES[1].id);
      createComponent({ localVue, store });
      expect(findSelect().element.value).toBe(store.state.Cart.delivery);
    });
  });

  describe("when created", () => {
    it("changes state delivery and order address when user deleted current order address", async () => {
      setDelivery(store, testAddress.id);
      setCartAddress(store, testAddress);
      createComponent({ localVue, store });
      expect(store.state.Cart.delivery).toBe(BASE_DELIVERIES[1].id);
      expect(store.state.Cart.orderAddress).toEqual({
        street: testAddress.street,
        building: testAddress.building,
        flat: testAddress.flat,
      });
    });
  });

  describe("when select emits change", () => {
    it("changes state delivery when select emits change", async () => {
      setDelivery(store, BASE_DELIVERIES[1].id);
      createComponent({ localVue, store });
      const select = findSelect();
      select.element.value = BASE_DELIVERIES[0].id;
      select.trigger("change");
      await nextTick();
      expect(store.state.Cart.delivery).toBe(BASE_DELIVERIES[0].id);
    });

    it("changes state order address to null when select emits change to 1st option", async () => {
      setDelivery(store, BASE_DELIVERIES[1].id);
      createComponent({ localVue, store });
      const select = findSelect();
      select.element.value = BASE_DELIVERIES[0].id;
      select.trigger("change");
      await nextTick();
      expect(store.state.Cart.orderAddress).toBe(null);
    });

    it("changes state order address to new address when select emits change to 2nd option", async () => {
      setDelivery(store, BASE_DELIVERIES[0].id);
      createComponent({ localVue, store });
      const select = findSelect();
      select.element.value = BASE_DELIVERIES[1].id;
      select.trigger("change");
      await nextTick();
      expect(store.state.Cart.orderAddress).toEqual({
        street: "",
        building: "",
        flat: "",
      });
    });

    it("changes state order address to user address when select emits change to 3rd option", async () => {
      setDelivery(store, BASE_DELIVERIES[0].id);
      setUserAddresses(store);
      createComponent({ localVue, store });
      const userAddress = store.state.Auth.addresses[0];
      const select = findSelect();
      select.element.value = userAddress.id;
      select.trigger("change");
      await nextTick();
      expect(store.state.Cart.orderAddress).toEqual(userAddress);
    });

    it("calls vuex action when select emits change", async () => {
      actions = {
        Cart: {
          setDelivery: jest.fn(),
        },
      };
      store = generateMockStore({ actions });
      setDelivery(store, BASE_DELIVERIES[1].id);
      createComponent({ localVue, store });
      const select = findSelect();
      select.element.value = BASE_DELIVERIES[0].id;
      select.trigger("change");
      await nextTick();
      expect(actions.Cart.setDelivery).toHaveBeenCalled();
    });
  });
});
