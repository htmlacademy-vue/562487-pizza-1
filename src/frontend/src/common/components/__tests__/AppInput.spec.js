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
  const inputErrorTextClass = "input__error-text";
  const inputErrorTextSelector = "." + inputErrorTextClass;

  let wrapper;
  const createComponent = (options) => {
    wrapper = shallowMount(AppInput, options);
  };

  afterEach(() => {
    wrapper.destroy();
  });

  it("it renders label that contains span and input", () => {
    createComponent({ propsData });
    const wrapperEl = wrapper.element;
    const childrenEls = wrapperEl.children;
    expect(wrapperEl.tagName.toLowerCase()).toBe("label");
    expect(childrenEls[0].tagName.toLowerCase()).toBe("span");
    expect(childrenEls[1].tagName.toLowerCase()).toBe("input");
  });

  it("input label text is prop label", () => {
    createComponent({ propsData });
    const labelEl = wrapper.find("span");
    expect(labelEl.exists()).toBe(true);
    expect(labelEl.text()).toBe(propsData.label);
  });

  it("input label with visually-hidden class", () => {
    createComponent({
      propsData: { ...propsData, labelIsHidden: true },
    });
    const hiddenLabel = wrapper.find(".visually-hidden");
    expect(hiddenLabel.exists()).toBe(true);
    expect(hiddenLabel.text()).toBe(propsData.label);
  });

  it("default input type is text", () => {
    createComponent({ propsData: { ...defaultPropsData } });
    const input = wrapper.find("input");
    expect(input.attributes("type")).toBe(defaultInputType);
  });

  it("input type is prop type", () => {
    createComponent({ propsData });
    const input = wrapper.find("input");
    expect(input.attributes("type")).toBe(propsData.type);
  });

  it("input name is prop name", () => {
    createComponent({ propsData });
    const input = wrapper.find("input");
    expect(input.attributes("name")).toBe(propsData.name);
  });

  it("default input placeholder is empty string", () => {
    createComponent({ propsData: { ...defaultPropsData } });
    const input = wrapper.find("input");
    expect(input.attributes("placeholder")).toBe("");
  });

  it("input placeholder is prop placeholder", () => {
    createComponent({ propsData });
    const input = wrapper.find("input");
    expect(input.attributes("placeholder")).toBe(propsData.placeholder);
  });

  it("default input value is empty string", () => {
    createComponent({ propsData: { ...defaultPropsData } });
    const input = wrapper.find("input");
    expect(input.element.value).toBe("");
  });

  it("input value is prop value", () => {
    createComponent({ propsData });
    const input = wrapper.find("input");
    expect(input.element.value).toBe(propsData.value);
  });

  it("default input is not readonly", () => {
    createComponent({ propsData });
    const input = wrapper.find("input");
    expect(input.attributes("readonly")).toBeFalsy();
  });

  it("input is readonly", async () => {
    createComponent({
      propsData: { ...propsData, readonly: true },
    });
    const input = wrapper.find("input");
    expect(input.attributes("readonly")).toBe("readonly");
  });

  it("input with error has error class", () => {
    createComponent({
      propsData: { ...propsData, error: inputError },
    });
    const input = wrapper.find("input");
    expect(input.classes(inputErrorClass)).toBe(true);
  });

  it("input without error does not have error class", () => {
    createComponent({ propsData });
    const input = wrapper.find("input");
    expect(input.classes(inputErrorClass)).toBe(false);
  });

  it("input with error message", () => {
    createComponent({
      propsData: { ...propsData, error: inputError },
    });
    const errorEl = wrapper.find(inputErrorTextSelector);
    expect(errorEl.exists()).toBe(true);
    expect(errorEl.text()).toBe(inputError);
  });

  it("input without error message", () => {
    createComponent({ propsData });
    expect(wrapper.find(inputErrorTextSelector).exists()).toBe(false);
  });

  it("it emits an input event when typing", async () => {
    createComponent({ propsData });
    const input = wrapper.find("input");
    await input.trigger("input");
    expect(wrapper.emitted().input).toBeTruthy();
  });

  it("input has current value when emits input event", async () => {
    const currentValue = "keks";
    createComponent({ propsData });
    const input = wrapper.find("input");
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