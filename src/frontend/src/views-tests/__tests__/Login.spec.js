import { createLocalVue, shallowMount, mount } from "@vue/test-utils";
import { nextTick } from "vue";
import Login from "@/views/index/^login";
import { setUIComponents } from "@/plugins/ui";

const localVue = createLocalVue();
setUIComponents(localVue);

describe("Login", () => {
  const stubs = ["router-link"];
  const mocks = {
    $router: {
      push: jest.fn(),
    },
  };
  let wrapper;
  const createComponent = (options) => {
    wrapper = shallowMount(Login, options);
  };

  const findCloseBtn = () => wrapper.find("[data-test='login-close']");
  const findTitle = () => wrapper.find("[data-test='login-title']");
  const findLoginForm = () => wrapper.findComponent({ name: "LoginForm" });
  const findOverlay = () => wrapper.findComponent({ name: "PopupOverlay" });

  beforeEach(() => {
    mocks.$router.push = jest.fn();
  });

  afterEach(() => {
    wrapper.destroy();
  });

  it("renders out login view", () => {
    createComponent({ localVue, stubs });
    expect(wrapper.exists()).toBe(true);
  });

  it("renders out link to index route as close button", () => {
    createComponent({ localVue, stubs });
    const closeBtn = findCloseBtn();
    expect(closeBtn.exists()).toBe(true);
    expect(closeBtn.attributes().to).toBe("/");
  });

  it("renders out login title", () => {
    createComponent({ localVue, stubs, mocks });
    expect(findTitle().exists()).toBe(true);
  });

  it("renders out login form", () => {
    createComponent({ localVue, stubs, mocks });
    expect(findLoginForm().exists()).toBe(true);
  });

  it("goes to index route on PopupOverlay click.self", async () => {
    wrapper = mount(Login, { localVue, stubs, mocks });
    await findOverlay().trigger("click.self");
    expect(mocks.$router.push).toHaveBeenCalledWith("/");
  });

  it("goes to index route on PopupOverlay keydown.esc", async () => {
    wrapper = mount(Login, { localVue, stubs, mocks });
    await findOverlay().trigger("keydown.esc");
    expect(mocks.$router.push).toHaveBeenCalledWith("/");
  });

  it("goes to index route on LoginForm close", async () => {
    createComponent({ localVue, stubs, mocks });
    findLoginForm().vm.$emit("close");
    await nextTick();
    expect(mocks.$router.push).toHaveBeenCalledWith("/");
  });
});
