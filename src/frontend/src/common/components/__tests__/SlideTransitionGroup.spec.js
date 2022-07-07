import { shallowMount } from "@vue/test-utils";
import SlideTransitionGroup from "@/common/components/SlideTransitionGroup";

describe("SlideTransitionGroup", () => {
  const slots = { default: "content" };

  let wrapper;
  const createComponent = (options) => {
    wrapper = shallowMount(SlideTransitionGroup, options);
  };

  afterEach(() => {
    wrapper.destroy();
  });

  it("renders out the slot content", () => {
    createComponent({ slots });
    expect(wrapper.html()).toContain(slots.default);
  });
});
