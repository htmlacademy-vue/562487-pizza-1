import { createLocalVue, shallowMount } from "@vue/test-utils";
import AppLayout from "../AppLayout";
import { setUIComponents } from "@/plugins/ui";

const localVue = createLocalVue();
setUIComponents(localVue);

describe("AppLayout", () => {
  const slots = { default: "content" };
  const stubs = ["router-link"];
  let wrapper;
  const createComponent = (options) => {
    wrapper = shallowMount(AppLayout, options);
  };

  afterEach(() => {
    wrapper.destroy();
  });

  it("renders out app layout", () => {
    createComponent({ localVue, slots, stubs });
    expect(wrapper.exists()).toBe(true);
  });

  it("renders out app layout default", () => {
    createComponent({ localVue, slots, stubs });
    const defaultLayout = wrapper.findComponent({ name: "AppLayoutDefault" });
    expect(defaultLayout.exists()).toBe(true);
  });

  it("renders out AppLayoutMain with slot content if isMainLayout", async () => {
    createComponent({ localVue, slots, stubs });
    await wrapper.setData({
      isMainLayout: true,
    });
    const mainLayout = wrapper.findComponent({ name: "AppLayoutMain" });
    expect(mainLayout.exists()).toBe(true);
    expect(mainLayout.html()).toContain(slots.default);
  });

  it("renders out slot content if not isMainLayout", () => {
    createComponent({ localVue, slots, stubs });
    const mainLayout = wrapper.findComponent({ name: "AppLayoutMain" });
    expect(mainLayout.exists()).toBe(false);
    expect(wrapper.html()).toContain(slots.default);
  });
});
