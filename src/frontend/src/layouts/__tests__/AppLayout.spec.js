import { createLocalVue, shallowMount } from "@vue/test-utils";
import AppLayout from "../AppLayout";
import { setUIComponents } from "@/plugins/ui";
import { nextTick } from "vue";
import VueRouter from "vue-router";

const localVue = createLocalVue();
localVue.use(VueRouter);
setUIComponents(localVue);

describe("AppLayout", () => {
  const slots = { default: "content" };
  const stubs = ["router-link"];
  let wrapper;
  const createComponent = (options) => {
    wrapper = shallowMount(AppLayout, options);
  };

  const findLayoutDefault = () => wrapper.findComponent({ name: "AppLayoutDefault" });
  const findLayoutMain = () => wrapper.findComponent({ name: "AppLayoutMain" });

  afterEach(() => {
    wrapper.destroy();
  });

  it("renders out app layout", () => {
    createComponent({ localVue, slots, stubs });
    expect(wrapper.exists()).toBe(true);
  });

  it("renders out app layout default", () => {
    createComponent({ localVue, slots, stubs });
    expect(findLayoutDefault().exists()).toBe(true);
  });

  it("renders out AppLayoutMain with slot content if isMainLayout", async () => {
    const route = {
      to: {
        meta: {
          layout: "AppLayoutMain",
        },
      },
      from: {
        meta: {
          layout: "AppLayoutMain",
        },
      },
    };
    createComponent({ localVue, slots, stubs });
    AppLayout.watch.$route.call(wrapper.vm, route.to, route.from);
    await nextTick();
    const mainLayout = findLayoutMain();
    expect(mainLayout.exists()).toBe(true);
    expect(mainLayout.html()).toContain(slots.default);
  });

  it("renders out slot content if not isMainLayout", () => {
    createComponent({ localVue, slots, stubs });
    expect(findLayoutMain().exists()).toBe(false);
    expect(wrapper.html()).toContain(slots.default);
  });
});
