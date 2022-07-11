import { createLocalVue, shallowMount } from "@vue/test-utils";
import AppLayout from "../AppLayout";
import { setUIComponents } from "@/plugins/ui";
import { nextTick } from "vue";

const localVue = createLocalVue();
setUIComponents(localVue);

describe("AppLayout", () => {
  let mocks = {
    $route: {
      meta: {
        layout: "AppLayoutDefault",
      },
    },
  };
  const slots = { default: "content" };
  const stubs = ["router-link"];
  let wrapper;
  const createComponent = (options) => {
    wrapper = shallowMount(AppLayout, options);
  };

  const findLayoutDefault = () =>
    wrapper.findComponent({ name: "AppLayoutDefault" });
  const findLayoutMain = () => wrapper.findComponent({ name: "AppLayoutMain" });

  beforeEach(() => {
    mocks.$route.meta.layout = "AppLayoutDefault";
  });

  afterEach(() => {
    wrapper.destroy();
  });

  it("renders out app layout", () => {
    createComponent({ localVue, slots, stubs, mocks });
    expect(wrapper.exists()).toBe(true);
  });

  it("renders out default app layout", () => {
    createComponent({ localVue, slots, stubs, mocks });
    expect(findLayoutDefault().exists()).toBe(true);
  });

  it("renders out AppLayoutMain with slot content if isMainLayout", async () => {
    mocks.$route.meta.layout = "AppLayoutMain";
    createComponent({ localVue, slots, stubs, mocks });
    await nextTick();
    const mainLayout = findLayoutMain();
    expect(mainLayout.exists()).toBe(true);
    expect(mainLayout.html()).toContain(slots.default);
  });

  it("renders out slot content if not isMainLayout", () => {
    createComponent({ localVue, slots, stubs, mocks });
    expect(findLayoutMain().exists()).toBe(false);
    expect(wrapper.html()).toContain(slots.default);
  });
});
