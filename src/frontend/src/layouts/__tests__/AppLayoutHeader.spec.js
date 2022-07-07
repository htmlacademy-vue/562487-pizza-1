import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuex from "vuex";
import { generateMockStore } from "@/store/mocks";
import AppLayoutHeader from "../AppLayoutHeader";
import { setUIComponents } from "@/plugins/ui";
import { setUser, testUser, setCart, setLoadData } from "@/store/mocks/setters";

const localVue = createLocalVue();
localVue.use(Vuex);
setUIComponents(localVue);

describe("AppLayoutHeader", () => {
  const stubs = ["router-link"];
  let store;
  let wrapper;
  const createComponent = (options) => {
    wrapper = shallowMount(AppLayoutHeader, options);
  };

  const findLogo = () => wrapper.findComponent({ name: "Logo" });
  const findCartLink = () => wrapper.find("[data-test='link-cart']");
  const findLoginLink = () => wrapper.find("[data-test='link-login']");
  const findProfileLink = () => wrapper.find("[data-test='link-profile']");
  const findLogoutLink = () => wrapper.find("[data-test='logout']");

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
    expect(findLogo().exists()).toBe(true);
  });

  it("renders out link to cart", () => {
    const emptyCartText = "0 ₽";
    createComponent({ localVue, store, stubs });
    const cartLink = findCartLink();
    expect(cartLink.exists()).toBe(true);
    expect(cartLink.text()).toBe(emptyCartText);
  });

  it("displays cart total sum", () => {
    setLoadData(store);
    setCart(store);
    createComponent({ localVue, store, stubs });
    const totalSum = store.getters["Cart/totalSum"];
    const cartLink = findCartLink();
    expect(cartLink.exists()).toBe(true);
    expect(cartLink.text()).toBe(`${totalSum} ₽`);
  });

  it("renders out link to login when no user", () => {
    createComponent({ localVue, store, stubs });
    const loginLink = findLoginLink();
    expect(loginLink.exists()).toBe(true);
    expect(loginLink.text()).toBe("Войти");
  });

  it("renders out link to profile when is current user", () => {
    setUser(store);
    createComponent({ localVue, store, stubs });
    const profileLink = findProfileLink();
    expect(profileLink.exists()).toBe(true);
    expect(profileLink.text()).toContain(testUser.name);
  });

  it("renders out logout link when is current user", () => {
    setUser(store);
    createComponent({ localVue, store, stubs });
    const logoutLink = findLogoutLink();
    expect(logoutLink.exists()).toBe(true);
    expect(logoutLink.text()).toBe("Выйти");
  });

  it("calls $logout on logout click", async () => {
    setUser(store);
    createComponent({ localVue, store, stubs });
    const spyOnLogout = jest.spyOn(wrapper.vm, "$logout");
    await findLogoutLink().trigger("click");
    expect(spyOnLogout).toHaveBeenCalled();
  });
});
