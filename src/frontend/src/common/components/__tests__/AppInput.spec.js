import { shallowMount } from "@vue/test-utils";
import AppInput from "@/common/components/AppInput";

describe("AppInput", () => {
  const defaultInputType = "text";
  const inputName = "user-email";
  const propsData = {
    type: "email",
    value: "value@email.ru",
    label: "Email:",
    placeholder: "keks@email.ru",
    name: inputName,
  };
  const defaultPropsData = {
    label: "Email:",
    name: inputName,
  };
  const inputError = "Email is not correct";
  const inputErrorClass = "input__input--error";
  const hiddenClass = "visually-hidden";

  let wrapper;
  const createComponent = (options) => {
    wrapper = shallowMount(AppInput, options);
  };

  const findInput = () => wrapper.find("input");
  const findLabel = () => wrapper.find("[data-test='input-label']");
  const findErrorText = () => wrapper.find("[data-test='input-error']");

  afterEach(() => {
    wrapper.destroy();
  });

  it("it renders label and input", () => {
    createComponent({ propsData });
    expect(wrapper.exists()).toBe(true);
    expect(findLabel().exists()).toBe(true);
    expect(findInput().exists()).toBe(true);
  });

  it("input label text is prop label", () => {
    createComponent({ propsData });
    expect(findLabel().text()).toBe(propsData.label);
  });

  it("default input label without visually-hidden class", () => {
    createComponent({ propsData });
    expect(findLabel().classes(hiddenClass)).toBe(false);
  });

  it("input label with visually-hidden class", () => {
    createComponent({
      propsData: { ...propsData, labelIsHidden: true },
    });
    const hiddenLabel = findLabel();
    expect(hiddenLabel.classes(hiddenClass)).toBe(true);
    expect(hiddenLabel.text()).toBe(propsData.label);
  });

  it("default input type is text", () => {
    createComponent({ propsData: { ...defaultPropsData } });
    expect(findInput().attributes("type")).toBe(defaultInputType);
  });

  it("input type is prop type", () => {
    createComponent({ propsData });
    expect(findInput().attributes("type")).toBe(propsData.type);
  });

  it("input name is prop name", () => {
    createComponent({ propsData });
    expect(findInput().attributes("name")).toBe(propsData.name);
  });

  it("default input placeholder is empty string", () => {
    createComponent({ propsData: { ...defaultPropsData } });
    expect(findInput().attributes("placeholder")).toBe("");
  });

  it("input placeholder is prop placeholder", () => {
    createComponent({ propsData });
    expect(findInput().attributes("placeholder")).toBe(propsData.placeholder);
  });

  it("default input value is empty string", () => {
    createComponent({ propsData: { ...defaultPropsData } });
    expect(findInput().element.value).toBe("");
  });

  it("input value is prop value", () => {
    createComponent({ propsData });
    expect(findInput().element.value).toBe(propsData.value);
  });

  it("default input is not readonly", () => {
    createComponent({ propsData });
    expect(findInput().attributes("readonly")).toBeFalsy();
  });

  it("input is readonly", async () => {
    createComponent({
      propsData: { ...propsData, readonly: true },
    });
    expect(findInput().attributes("readonly")).toBe("readonly");
  });

  it("input with error has error class", () => {
    createComponent({
      propsData: { ...propsData, error: inputError },
    });
    expect(findInput().classes(inputErrorClass)).toBe(true);
  });

  it("input without error has not error class", () => {
    createComponent({ propsData });
    expect(findInput().classes(inputErrorClass)).toBe(false);
  });

  it("input with error message", () => {
    createComponent({
      propsData: { ...propsData, error: inputError },
    });
    const errorEl = findErrorText();
    expect(errorEl.exists()).toBe(true);
    expect(errorEl.text()).toBe(inputError);
  });

  it("input without error message", () => {
    createComponent({ propsData });
    expect(findErrorText().exists()).toBe(false);
  });

  it("it emits an input event when typing", async () => {
    createComponent({ propsData });
    await findInput().trigger("input");
    expect(wrapper.emitted().input).toBeTruthy();
  });

  it("input has current value when emits input event", async () => {
    const currentValue = "keks";
    createComponent({ propsData });
    const input = findInput();
    input.element.value = currentValue;
    await input.trigger("input");
    expect(wrapper.emitted().input[0][0]).toBe(currentValue);
  });

  it("input has input ref", async () => {
    createComponent({ propsData });
    const inputRef = wrapper.findComponent({ ref: "input" });
    expect(inputRef.exists()).toBe(true);
  });
});
