import { shallowMount } from "@vue/test-utils";
import AppLayoutContent from "../AppLayoutContent";

describe("AppLayoutContent", () => {
  const slots = { default: "content" };
  let wrapper;
  const createComponent = (options) => {
    wrapper = shallowMount(AppLayoutContent, options);
  };

  afterEach(() => {
    wrapper.destroy();
  });

  it("renders out content layout", () => {
    createComponent({ slots });
    expect(wrapper.exists()).toBe(true);
  });

  it("renders out slot content", () => {
    createComponent({ slots });
    expect(wrapper.html()).toContain(slots.default);
  });
});
