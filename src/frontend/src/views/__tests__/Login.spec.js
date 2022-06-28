import { createLocalVue, mount } from "@vue/test-utils";
import Login from "../Login";
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
    wrapper = mount(Login, options);
  };

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
    const closeBtn = wrapper.find("[data-test='login-close']");
    expect(closeBtn.attributes().to).toBe("/");
  });

  it("renders out login title", () => {
    createComponent({ localVue, stubs, mocks });
    const loginTitle = wrapper.find("[data-test='login-title']");
    expect(loginTitle.exists()).toBe(true);
  });

  it("renders out login form", () => {
    createComponent({ localVue, stubs, mocks });
    const loginForm = wrapper.findComponent({ name: "LoginForm" });
    expect(loginForm.exists()).toBe(true);
  });

  it("goes to index route on PopupOverlay click.self", async () => {
    createComponent({ localVue, stubs, mocks });
    const overlay = wrapper.find("[data-test='overlay']");
    await overlay.trigger("click.self");
    expect(mocks.$router.push).toHaveBeenCalledWith("/");
  });

  it("goes to index route on PopupOverlay keydown.esc", async () => {
    createComponent({ localVue, stubs, mocks });
    const overlay = wrapper.findComponent({ name: "PopupOverlay" });
    await overlay.trigger("keydown.esc");
    expect(mocks.$router.push).toHaveBeenCalledWith("/");
  });

  it("goes to index route on LoginForm close", () => {
    createComponent({ localVue, stubs, mocks });
    const loginForm = wrapper.findComponent({ name: "LoginForm" });
    loginForm.vm.$emit("close");
    expect(mocks.$router.push).toHaveBeenCalledWith("/");
  });
});
