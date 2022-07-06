import { createLocalVue, mount } from "@vue/test-utils";
import Vuex from "vuex";
import { nextTick } from "vue";
import { generateMockStore } from "@/store/mocks";
import LoginForm from "../components/LoginForm";
import { setUIComponents } from "@/plugins/ui";

const localVue = createLocalVue();
localVue.use(Vuex);
setUIComponents(localVue);

describe("LoginForm", () => {
  const loginData = {
    email: "keks@ya.ru",
    password: "123456",
  };

  let actions;
  let store;
  let wrapper;
  const createComponent = (options) => {
    wrapper = mount(LoginForm, options);
  };
  const findEmail = () => wrapper.find("[data-test='login-email']");
  const findEmailInput = () => findEmail().find("input");
  const findEmailError = () => findEmail().find("[data-test='input-error']");
  const findPassword = () => wrapper.find("[data-test='login-password']");
  const findPasswordInput = () => findPassword().find("input");
  const findPasswordError = () =>
    findPassword().find("[data-test='input-error']");
  const findSubmit = () => wrapper.find("[type='submit']");
  const findForm = () => wrapper.find("form");

  const fillEmailInput = async (userEmail) => {
    const emailInput = findEmailInput();
    emailInput.element.value = userEmail;
    emailInput.trigger("input");
    await nextTick();
  };

  const fillPasswordInput = async (userPassword) => {
    const passwordInput = findPasswordInput();
    passwordInput.element.value = userPassword;
    passwordInput.trigger("input");
    await nextTick();
  };

  const triggerSubmit = async () => {
    findForm().trigger("submit");
    await nextTick();
  };

  beforeEach(() => {
    actions = {
      Auth: {
        login: jest.fn(() => Promise.resolve()),
      },
    };
    store = generateMockStore({ actions });
  });

  afterEach(() => {
    wrapper.destroy();
  });

  it("renders out login form", () => {
    createComponent({ localVue, store });
    expect(wrapper.exists()).toBe(true);
    expect(findEmail().exists()).toBe(true);
    expect(findPassword().exists()).toBe(true);
  });

  it("renders out with email input focused", () => {
    const div = document.createElement("div");
    div.id = "root";
    document.body.appendChild(div);
    createComponent({ localVue, store, attachTo: "#root" });
    const focusedInput = wrapper.find("input:focus");
    expect(focusedInput.exists()).toBe(true);
    expect(focusedInput.attributes().name).toBe("email");
  });

  it("renders out email validation error", async () => {
    createComponent({ localVue, store });
    await fillEmailInput("wrong-email");
    await triggerSubmit();
    const errorMessage = findEmailError();
    expect(errorMessage.exists()).toBe(true);
  });

  it("renders out password validation error", async () => {
    createComponent({ localVue, store });
    await fillPasswordInput("");
    await triggerSubmit();
    const errorMessage = findPasswordError();
    expect(errorMessage.exists()).toBe(true);
  });

  it("renders out submit button not disabled", () => {
    createComponent({ localVue, store });
    expect(findSubmit().element.disabled).toBe(false);
  });

  it("renders out submit button disabled when submitting", async () => {
    createComponent({ localVue, store });
    await fillEmailInput(loginData.email);
    await fillPasswordInput(loginData.password);
    await triggerSubmit();
    expect(findSubmit().element.disabled).toBe(true);
  });

  it("calls login action on submit", async () => {
    createComponent({ localVue, store });
    await fillEmailInput(loginData.email);
    await fillPasswordInput(loginData.password);
    await triggerSubmit();
    await nextTick();
    expect(actions.Auth.login).toHaveBeenCalled();
  });

  it("emits close on login success", async () => {
    createComponent({ localVue, store });
    await fillEmailInput(loginData.email);
    await fillPasswordInput(loginData.password);
    await triggerSubmit();
    await nextTick();
    expect(wrapper.emitted().close).toBeTruthy();
  });

  it("does not emit close on login error", async () => {
    actions = {
      Auth: {
        login: jest.fn(() => Promise.reject()),
      },
    };
    store = generateMockStore({ actions });
    createComponent({ localVue, store });
    await fillEmailInput(loginData.email);
    await fillPasswordInput(loginData.password);
    await triggerSubmit();
    await nextTick();
    expect(wrapper.emitted().close).toBeFalsy();
  });
});
