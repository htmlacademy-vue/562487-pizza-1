import { shallowMount } from "@vue/test-utils";
import PopupTransition from "@/common/components/PopupTransition";

describe("PopupTransition", () => {
  const slots = { default: "content" };

  let wrapper;
  const createComponent = (options) => {
    wrapper = shallowMount(PopupTransition, options);
  };

  afterEach(() => {
    wrapper.destroy();
  });

  it("renders out the slot content", () => {
    createComponent({
      slots,
    });
    expect(wrapper.html()).toContain(slots.default);
  });
});
