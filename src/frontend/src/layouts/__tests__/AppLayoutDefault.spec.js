import { createLocalVue, shallowMount } from "@vue/test-utils";
import AppLayoutDefault from "../AppLayoutDefault";
import { setUIComponents } from "@/plugins/ui";

const localVue = createLocalVue();
setUIComponents(localVue);

describe("AppLayoutDefault", () => {
  const slots = { default: "content" };
  let wrapper;
  const createComponent = (options) => {
    wrapper = shallowMount(AppLayoutDefault, options);
  };

  afterEach(() => {
    wrapper.destroy();
  });

  it("renders out default layout", () => {
    createComponent({ localVue, slots });
    expect(wrapper.exists()).toBe(true);
  });

  it("renders out app notifications", () => {
    createComponent({ localVue, slots });
    const notifications = wrapper.findComponent({ name: "AppNotifications" });
    expect(notifications.exists()).toBe(true);
  });

  it("renders out app header", () => {
    createComponent({ localVue, slots });
    const header = wrapper.findComponent({ name: "AppLayoutHeader" });
    expect(header.exists()).toBe(true);
  });

  it("renders out slot content", () => {
    createComponent({ localVue, slots });
    expect(wrapper.html()).toContain(slots.default);
  });
});
