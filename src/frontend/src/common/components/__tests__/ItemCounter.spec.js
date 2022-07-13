import { shallowMount } from "@vue/test-utils";
import ItemCounter from "@/common/components/ItemCounter";

describe("ItemCounter", () => {
  const propsData = {
    quantity: 1,
    min: 0,
    max: 3,
  };

  let wrapper;
  const createComponent = (options) => {
    wrapper = shallowMount(ItemCounter, options);
  };

  const findMinusBtn = () => wrapper.find("[data-test='button-minus']");
  const findPlusBtn = () => wrapper.find("[data-test='button-plus']");
  const findInput = () => wrapper.find("[data-test='counter-input']");

  afterEach(() => {
    wrapper.destroy();
  });

  it("it renders plus and minus buttons and input", () => {
    createComponent({ propsData });
    expect(findMinusBtn().exists()).toBe(true);
    expect(findPlusBtn().exists()).toBe(true);
    expect(findInput().exists()).toBe(true);
  });

  it("minus button not disabled", () => {
    createComponent({ propsData });
    expect(findMinusBtn().element.disabled).toBe(false);
  });

  it("minus button disabled", () => {
    createComponent({ propsData: { ...propsData, quantity: 0 } });
    expect(findMinusBtn().element.disabled).toBe(true);
  });

  it("it emits decrement on minus button click", async () => {
    createComponent({ propsData });
    await findMinusBtn().trigger("click");
    expect(wrapper.emitted().decrement).toBeTruthy();
    expect(wrapper.emitted().decrement.length).toBe(1);
  });

  it("counter input value is prop quantity", () => {
    createComponent({ propsData });
    expect(+findInput().element.value).toBe(propsData.quantity);
  });

  it("plus button not disabled", () => {
    createComponent({ propsData });
    expect(findPlusBtn().element.disabled).toBe(false);
  });

  it("plus button disabled", () => {
    createComponent({ propsData: { ...propsData, quantity: propsData.max } });
    expect(findPlusBtn().element.disabled).toBe(true);
  });

  it("it emits increment on plus button click", async () => {
    createComponent({ propsData });
    await findPlusBtn().trigger("click");
    expect(wrapper.emitted().increment).toBeTruthy();
    expect(wrapper.emitted().increment.length).toBe(1);
  });
});
