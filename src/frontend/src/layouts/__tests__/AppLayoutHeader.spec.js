import { createLocalVue, mount } from "@vue/test-utils";
import Vuex from "vuex";
import { generateMockStore } from "@/store/mocks";
import AppLayoutHeader from "../AppLayoutHeader";
import { setUIComponents } from "@/plugins/ui";
import { setUser, testUser, setCart } from "@/store/mocks/setters";

const localVue = createLocalVue();
localVue.use(Vuex);
setUIComponents(localVue);

describe("AppLayoutHeader", () => {
  const stubs = ["router-link"];
  let store;
  let wrapper;
  const createComponent = (options) => {
    wrapper = mount(AppLayoutHeader, options);
  };

  beforeEach(() => {
    store = generateMockStore();
  });

  afterEach(() => {
    wrapper.destroy();
  });

  it("renders out header layout", () => {
    createComponent({ localVue, store, stubs });
    expect(wrapper.exists()).toBe(true);
  });

  it("renders out logo", () => {
    createComponent({ localVue, store, stubs });
    const logo = wrapper.findComponent({ name: "Logo" });
    expect(logo.exists()).toBe(true);
  });

  it("renders out link to cart", () => {
    const emptyCartText = "0 ₽";
    createComponent({ localVue, store, stubs });
    const cartLink = wrapper.find("[data-test='link-cart']");
    expect(cartLink.exists()).toBe(true);
    expect(cartLink.text()).toBe(emptyCartText);
  });

  it("displays cart total sum", () => {
    setCart(store);
    createComponent({ localVue, store, stubs });
    const totalSum = store.getters["Cart/totalSum"];
    const cartLink = wrapper.find("[data-test='link-cart']");
    expect(cartLink.exists()).toBe(true);
    expect(cartLink.text()).toBe(`${totalSum} ₽`);
  });

  it("renders out link to login when no user", () => {
    createComponent({ localVue, store, stubs });
    const loginLink = wrapper.find("[data-test='link-login']");
    expect(loginLink.exists()).toBe(true);
    expect(loginLink.text()).toBe("Войти");
  });

  it("renders out link to profile when is current user", () => {
    setUser(store);
    createComponent({ localVue, store, stubs });
    const profileLink = wrapper.find("[data-test='link-profile']");
    expect(profileLink.exists()).toBe(true);
    expect(profileLink.text()).toContain(testUser.name);
  });

  it("renders out logout link when is current user", () => {
    setUser(store);
    createComponent({ localVue, store, stubs });
    const logoutLink = wrapper.find("[data-test='logout']");
    expect(logoutLink.exists()).toBe(true);
    expect(logoutLink.text()).toBe("Выйти");
  });

  it("calls $logout on logout click", async () => {
    setUser(store);
    createComponent({ localVue, store, stubs });
    const spyOnLogout = jest.spyOn(wrapper.vm, "$logout");
    const logoutLink = wrapper.find("[data-test='logout']");
    await logoutLink.trigger("click");
    expect(spyOnLogout).toHaveBeenCalled();
  });
});
