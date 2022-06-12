import { shallowMount } from "@vue/test-utils";
import ItemCounter from "@/common/components/ItemCounter";

describe("ItemCounter", () => {
  const propsData = {
    quantity: 1,
    min: 0,
    max: 3,
  };
  const btnMinusSelector = "[data-test='button-minus']";
  const btnPlusSelector = "[data-test='button-plus']";
  const counterInputSelector = "[data-test='counter-input']";

  let wrapper;
  const createComponent = (options) => {
    wrapper = shallowMount(ItemCounter, options);
  };

  afterEach(() => {
    wrapper.destroy();
  });

  it("it renders minus button", () => {
    createComponent({ propsData });
    expect(wrapper.find(btnMinusSelector).exists()).toBe(true);
  });

  it("minus button not disabled", () => {
    createComponent({ propsData });
    const minusBtn = wrapper.find(btnMinusSelector);
    expect(minusBtn.element.disabled).toBe(false);
  });

  it("minus button disabled", () => {
    createComponent({ propsData: { ...propsData, quantity: 0 } });
    const minusBtn = wrapper.find(btnMinusSelector);
    expect(minusBtn.element.disabled).toBe(true);
  });

  it("it emits decrementClick on minus button click", async () => {
    createComponent({ propsData });
    const minusBtn = wrapper.find(btnMinusSelector);
    await minusBtn.trigger("click");
    expect(wrapper.emitted().decrementClick).toBeTruthy();
    expect(wrapper.emitted().decrementClick.length).toBe(1);
  });

  it("it renders counter input", () => {
    createComponent({ propsData });
    expect(wrapper.find(counterInputSelector).exists()).toBe(true);
  });

  it("counter input value is prop quantity", () => {
    createComponent({ propsData });
    const counterInput = wrapper.find(counterInputSelector);
    expect(+counterInput.element.value).toBe(propsData.quantity);
  });

  it("it renders plus button", () => {
    createComponent({ propsData });
    expect(wrapper.find(btnPlusSelector).exists()).toBe(true);
  });

  it("plus button not disabled", () => {
    createComponent({ propsData });
    const plusBtn = wrapper.find(btnPlusSelector);
    expect(plusBtn.element.disabled).toBe(false);
  });

  it("plus button disabled", () => {
    createComponent({ propsData: { ...propsData, quantity: propsData.max } });
    const plusBtn = wrapper.find(btnPlusSelector);
    expect(plusBtn.element.disabled).toBe(true);
  });

  it("it emits incrementClick on plus button click", async () => {
    createComponent({ propsData });
    const plusBtn = wrapper.find(btnPlusSelector);
    await plusBtn.trigger("click");
    expect(wrapper.emitted().incrementClick).toBeTruthy();
    expect(wrapper.emitted().incrementClick.length).toBe(1);
  });
});
