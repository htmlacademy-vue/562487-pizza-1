import { shallowMount } from "@vue/test-utils";
import RadioButton from "@/common/components/RadioButton";
import pizzaData from "@/static/pizza.json";
import { Sauce, Size } from "@/common/models";

describe("RadioButton", () => {
  let wrapper;
  const slots = { default: "content" };
  const sizeItem = new Size(pizzaData.sizes[0]);
  const sauceItem = new Sauce(pizzaData.sauces[0]);
  const defaultPropsData = { item: sizeItem, isChecked: false };

  const createComponent = (options) => {
    wrapper = shallowMount(RadioButton, options);
  };

  afterEach(() => {
    wrapper.destroy();
  });

  it("displays label with radioButtonClasses", () => {
    createComponent({ propsData: defaultPropsData });
    const { kind, value } = defaultPropsData.item;
    const radioButtonClasses = [`${kind}__input`, `${kind}__input--${value}`];
    expect(wrapper.find("label").classes(radioButtonClasses[0])).toBe(true);
    expect(wrapper.find("label").classes(radioButtonClasses[1])).toBe(true);
  });

  it("displays label without radioButtonClasses", () => {
    createComponent({ propsData: { item: sauceItem, isChecked: false } });
    const { kind, value } = sauceItem;
    const radioButtonClasses = [`${kind}__input`, `${kind}__input--${value}`];
    expect(wrapper.find("label").classes(radioButtonClasses[0])).toBe(false);
    expect(wrapper.find("label").classes(radioButtonClasses[1])).toBe(false);
  });

  it("renders radio input", () => {
    createComponent({ propsData: defaultPropsData });
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find("[type='radio']").exists()).toBe(true);
  });

  it("renders out the slot content", () => {
    createComponent({ propsData: defaultPropsData, slots });
    expect(wrapper.html()).toContain(slots.default);
  });

  it("input name is prop item kind", () => {
    createComponent({ propsData: defaultPropsData });
    const input = wrapper.find("input");
    expect(input.attributes("name")).toBe(defaultPropsData.item.kind);
  });

  it("input value is prop item value", () => {
    createComponent({ propsData: defaultPropsData });
    const input = wrapper.find("input");
    expect(input.element.value).toBe(defaultPropsData.item.value);
  });

  it("input is not checked", () => {
    createComponent({ propsData: defaultPropsData });
    const input = wrapper.find("input");
    expect(input.element.checked).toBe(false);
  });

  it("input is checked", () => {
    createComponent({ propsData: { ...defaultPropsData, isChecked: true } });
    const input = wrapper.find("input");
    expect(input.element.checked).toBe(true);
  });

  it("emits change on radio selection", async () => {
    createComponent({ propsData: defaultPropsData });
    const input = wrapper.find("input");
    await input.trigger("click");
    expect(wrapper.emitted().change[0][0]).toEqual(defaultPropsData.item.id);
  });

  it("input dataset testId is prop item id", () => {
    createComponent({ propsData: defaultPropsData });
    const input = wrapper.find("input");
    const testId = +input.element.dataset.testId;
    expect(testId).toBe(defaultPropsData.item.id);
  });
});
