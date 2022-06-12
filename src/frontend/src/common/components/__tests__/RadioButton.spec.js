import { shallowMount } from "@vue/test-utils";
import RadioButton from "@/common/components/RadioButton";

describe("RadioButton", () => {
  let wrapper;
  const slots = { default: "content" };
  const propsData = {
    item: {
      id: 1,
      kind: "sauce",
      value: "tomato",
    },
    isChecked: false,
  };

  const createComponent = (options) => {
    wrapper = shallowMount(RadioButton, options);
  };

  afterEach(() => {
    wrapper.destroy();
  });

  it("it renders radio input", () => {
    createComponent({ propsData });
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find("[type='radio']").exists()).toBe(true);
  });

  it("it renders out the slot content", () => {
    createComponent({ propsData, slots });
    expect(wrapper.html()).toContain(slots.default);
  });

  it("input name is prop item kind", () => {
    createComponent({ propsData });
    const input = wrapper.find("input");
    expect(input.attributes("name")).toBe(propsData.item.kind);
  });

  it("input value is prop item value", () => {
    createComponent({ propsData });
    const input = wrapper.find("input");
    expect(input.element.value).toBe(propsData.item.value);
  });

  it("input is not checked", () => {
    createComponent({ propsData });
    const input = wrapper.find("input");
    expect(input.element.checked).toBe(false);
  });

  it("input is checked", () => {
    createComponent({ propsData: { ...propsData, isChecked: true } });
    const input = wrapper.find("input");
    expect(input.element.checked).toBe(true);
  });

  it("it emits change on radio selection", async () => {
    createComponent({ propsData });
    const input = wrapper.find("input");
    await input.trigger("click");
    expect(wrapper.emitted().change[0][0]).toEqual(propsData.item.id);
  });
});
