import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuex from "vuex";
import flushPromises from "flush-promises";
import { nextTick } from "vue";
import { generateMockStore } from "@/store/mocks";
import Profile from "../Profile";
import { setUIComponents } from "@/plugins/ui";
import { setUser, setUserAddresses } from "@/store/mocks/setters";

const localVue = createLocalVue();
localVue.use(Vuex);
setUIComponents(localVue);

describe("Profile", () => {
  const stubs = ["router-view"];
  const mocks = {
    $route: {
      name: "Profile",
    },
    $router: {
      push: jest.fn(),
    },
  };
  let actions;
  let store;
  let wrapper;
  const createComponent = (options) => {
    wrapper = shallowMount(Profile, options);
  };

  const findProfileUser = () => wrapper.findComponent({ name: "ProfileUser" });
  const findAllCards = () =>
    wrapper.findAllComponents({ name: "ProfileAddressCard" });
  const findOpenBtn = () => wrapper.find("[data-test='button-open'");

  beforeEach(() => {
    mocks.$route.name = "Profile";
    mocks.$router.push = jest.fn();
    actions = {
      Auth: {
        queryAddresses: jest.fn(() => Promise.resolve()),
      },
    };
    store = generateMockStore({ actions });
    setUser(store);
    setUserAddresses(store);
  });

  afterEach(() => {
    wrapper.destroy();
  });

  describe("profile view", () => {
    it("renders out profile view", async () => {
      createComponent({ localVue, stubs, store, mocks });
      await flushPromises();
      expect(wrapper.exists()).toBe(true);
    });

    it("calls vuex action when created", async () => {
      createComponent({ localVue, stubs, store, mocks });
      await flushPromises();
      expect(actions.Auth.queryAddresses).toHaveBeenCalled();
    });

    it("renders out profile user if user exists", async () => {
      createComponent({ localVue, stubs, store, mocks });
      await flushPromises();
      expect(findProfileUser().exists()).toBe(true);
    });

    it("renders out addresses", async () => {
      createComponent({ localVue, stubs, store, mocks });
      await flushPromises();
      const stateAddresses = store.state.Auth.addresses;
      expect(findAllCards().length).toBe(stateAddresses.length);
    });

    it("renders out open button", async () => {
      createComponent({ localVue, stubs, store, mocks });
      await flushPromises();
      expect(findOpenBtn().exists()).toBe(true);
    });
  });

  describe("profile view", () => {
    it("open button text when profile route", async () => {
      createComponent({ localVue, stubs, store, mocks });
      await flushPromises();
      expect(findOpenBtn().text()).toBe("Добавить новый адрес");
    });

    it("open button text when profile create route", async () => {
      mocks.$route.name = "ProfileCreate";
      createComponent({ localVue, stubs, store, mocks });
      await flushPromises();
      expect(findOpenBtn().text()).toBe("Закрыть форму");
    });

    it("goes to profile create route on open button click", async () => {
      createComponent({ localVue, stubs, store, mocks });
      await flushPromises();
      findOpenBtn().vm.$emit("click");
      await nextTick();
      expect(mocks.$router.push).toHaveBeenCalledWith("/profile/create");
    });

    it("goes to profile from profile create route on open button click", async () => {
      mocks.$route.name = "ProfileCreate";
      createComponent({ localVue, stubs, store, mocks });
      await flushPromises();
      findOpenBtn().vm.$emit("click");
      await nextTick();
      expect(mocks.$router.push).toHaveBeenCalledWith("/profile");
    });
  });
});
