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

  beforeEach(() => {
    actions = {
      Auth: {
        login: jest.fn(() => Promise.resolve()),
      },
    };
    store = generateMockStore(actions);
  });

  afterEach(() => {
    wrapper.destroy();
  });

  it("renders out login form", () => {
    createComponent({ localVue, store });
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find("[data-test='login-email']").exists()).toBe(true);
    expect(wrapper.find("[data-test='login-password']").exists()).toBe(true);
    expect(wrapper.vm.userData.email).toBe("");
    expect(wrapper.vm.userData.password).toBe("");
    expect(wrapper.vm.validations.email.error).toBe("");
    expect(wrapper.vm.validations.password.error).toBe("");
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
    const emailError = "email is required";
    createComponent({ localVue, store });
    await wrapper.setData({
      validations: {
        email: {
          error: emailError,
        },
      },
    });
    const emailField = wrapper.find("[data-test='login-email']");
    expect(emailField.text()).toContain(emailError);
  });

  it("renders out password validation error", async () => {
    const passwordError = "password is required";
    createComponent({ localVue, store });
    await wrapper.setData({
      validations: {
        password: {
          error: passwordError,
        },
      },
    });
    const passwordField = wrapper.find("[data-test='login-password']");
    expect(passwordField.text()).toContain(passwordError);
  });

  it("renders out submit button not disabled", () => {
    createComponent({ localVue, store });
    const submitBtn = wrapper.find("[type='submit']");
    expect(submitBtn.element.disabled).toBe(false);
  });

  it("renders out submit button disabled when isSubmitting", async () => {
    createComponent({ localVue, store });
    await wrapper.setData({ isSubmitting: true });
    const submitBtn = wrapper.find("[type='submit']");
    expect(submitBtn.element.disabled).toBe(true);
  });

  it("validates fields on submit", async () => {
    createComponent({ localVue, store });
    const spyOnValidateFields = jest.spyOn(wrapper.vm, "$validateFields");
    await wrapper.find("form").trigger("submit.prevent");
    expect(spyOnValidateFields).toHaveBeenCalled();
  });

  it("does not login when invalid form", async () => {
    createComponent({ localVue, store });
    const spyOnLogin = jest.spyOn(wrapper.vm, "login");
    await wrapper.find("form").trigger("submit.prevent");
    expect(wrapper.vm.isFormValid).toBe(false);
    expect(wrapper.vm.isSubmitting).toBe(false);
    expect(spyOnLogin).not.toHaveBeenCalled();
  });

  it("login success", async () => {
    createComponent({ localVue, store });
    const spyOnLogin = jest.spyOn(wrapper.vm, "login");
    await wrapper.setData({ userData: loginData });
    await wrapper.find("form").trigger("submit.prevent");
    expect(wrapper.vm.isSubmitting).toBe(true);
    expect(spyOnLogin).toHaveBeenCalledWith(loginData);
    await nextTick();
    expect(wrapper.emitted().close).toBeTruthy();
  });

  it("login error", async () => {
    actions = {
      Auth: {
        login: jest.fn(() => Promise.reject()),
      },
    };
    store = generateMockStore(actions);
    createComponent({ localVue, store });
    await wrapper.setData({ userData: loginData });
    await wrapper.find("form").trigger("submit.prevent");
    expect(wrapper.vm.isSubmitting).toBe(true);
    await nextTick();
    expect(wrapper.emitted().close).toBeFalsy();
    expect(wrapper.vm.isFormValid).toBe(false);
    expect(wrapper.vm.isSubmitting).toBe(false);
  });
});
