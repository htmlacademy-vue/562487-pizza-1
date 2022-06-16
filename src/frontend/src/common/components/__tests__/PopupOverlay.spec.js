import { shallowMount } from "@vue/test-utils";
import PopupOverlay from "@/common/components/PopupOverlay";

describe("PopupOverlay", () => {
  const slots = { default: "content" };
  const listeners = { click: null, keydown: null };

  let wrapper;
  const createComponent = (options) => {
    wrapper = shallowMount(PopupOverlay, options);
  };

  beforeEach(() => {
    listeners.click = jest.fn();
    listeners.keydown = jest.fn();
  });

  afterEach(() => {
    wrapper.destroy();
  });

  it("renders out the slot content", () => {
    createComponent({ slots });
    expect(wrapper.html()).toContain(slots.default);
  });

  it("raises the click event on click", async () => {
    createComponent({ listeners });
    await wrapper.find(".overlay").trigger("click");
    expect(listeners.click).toHaveBeenCalled();
  });

  it("raises the keydown event on escape keydown", async () => {
    createComponent({ listeners });
    await wrapper.find(".overlay").trigger("keydown.esc");
    expect(listeners.keydown).toHaveBeenCalled();
  });
});
