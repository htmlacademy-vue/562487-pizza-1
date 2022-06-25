import { shallowMount } from "@vue/test-utils";
import AppLayoutMain from "../AppLayoutMain";
import AppLayoutMainSidebar from "../AppLayoutMainSidebar";

describe("AppLayoutMain", () => {
  const slots = { default: "content" };
  let wrapper;
  const createComponent = (options) => {
    wrapper = shallowMount(AppLayoutMain, options);
  };

  afterEach(() => {
    wrapper.destroy();
  });

  it("renders out main layout", () => {
    createComponent({ slots });
    expect(wrapper.exists()).toBe(true);
  });

  it("renders out sidebar", () => {
    createComponent({ slots });
    expect(wrapper.findComponent(AppLayoutMainSidebar).exists()).toBeTruthy();
  });

  it("renders out slot content", () => {
    createComponent({ slots });
    expect(wrapper.html()).toContain(slots.default);
  });
});
