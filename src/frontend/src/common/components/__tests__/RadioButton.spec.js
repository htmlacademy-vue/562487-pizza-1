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

  const findInput = () => wrapper.find("[type='radio']");
  const findLabel = () => wrapper.find("label");

  afterEach(() => {
    wrapper.destroy();
  });

  it("displays label with radioButtonClasses", () => {
    createComponent({ propsData: defaultPropsData });
    const { kind, value } = defaultPropsData.item;
    const radioButtonClasses = [`${kind}__input`, `${kind}__input--${value}`];
    const label = findLabel();
    expect(label.classes(radioButtonClasses[0])).toBe(true);
    expect(label.classes(radioButtonClasses[1])).toBe(true);
  });

  it("displays label without radioButtonClasses", () => {
    createComponent({ propsData: { item: sauceItem, isChecked: false } });
    const { kind, value } = sauceItem;
    const radioButtonClasses = [`${kind}__input`, `${kind}__input--${value}`];
    const label = findLabel();
    expect(label.classes(radioButtonClasses[0])).toBe(false);
    expect(label.classes(radioButtonClasses[1])).toBe(false);
  });

  it("renders radio input", () => {
    createComponent({ propsData: defaultPropsData });
    expect(findInput().exists()).toBe(true);
  });

  it("renders out the slot content", () => {
    createComponent({ propsData: defaultPropsData, slots });
    expect(wrapper.html()).toContain(slots.default);
  });

  it("input name is prop item kind", () => {
    createComponent({ propsData: defaultPropsData });
    expect(findInput().attributes("name")).toBe(defaultPropsData.item.kind);
  });

  it("input value is prop item value", () => {
    createComponent({ propsData: defaultPropsData });
    expect(findInput().element.value).toBe(defaultPropsData.item.value);
  });

  it("input is not checked", () => {
    createComponent({ propsData: defaultPropsData });
    expect(findInput().element.checked).toBe(false);
  });

  it("input is checked", () => {
    createComponent({ propsData: { ...defaultPropsData, isChecked: true } });
    expect(findInput().element.checked).toBe(true);
  });

  it("emits change on radio selection", async () => {
    createComponent({ propsData: defaultPropsData });
    await findInput().trigger("click");
    expect(wrapper.emitted().change[0][0]).toEqual(defaultPropsData.item.id);
  });

  it("input dataset testId is prop item id", () => {
    createComponent({ propsData: defaultPropsData });
    const testId = +findInput().element.dataset.testId;
    expect(testId).toBe(defaultPropsData.item.id);
  });
});
