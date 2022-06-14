import { shallowMount } from "@vue/test-utils";
import PopupButton from "@/common/components/PopupButton";

describe("PopupButton", () => {
  const slots = { default: "content" };
  const listeners = { click: null };

  let wrapper;
  const createComponent = (options) => {
    wrapper = shallowMount(PopupButton, options);
  };

  beforeEach(() => {
    listeners.click = jest.fn();
  });

  afterEach(() => {
    wrapper.destroy();
  });

  it("it renders out the slot content", () => {
    createComponent({ slots });
    expect(wrapper.html()).toContain(slots.default);
  });

  it("raises the click event on click", async () => {
    createComponent({ listeners });
    await wrapper.find(".button").trigger("click");
    expect(listeners.click).toHaveBeenCalled();
  });

  it("button has button ref", async () => {
    createComponent();
    const buttonRef = wrapper.findComponent({ ref: "button" });
    expect(buttonRef.exists()).toBe(true);
  });
});
