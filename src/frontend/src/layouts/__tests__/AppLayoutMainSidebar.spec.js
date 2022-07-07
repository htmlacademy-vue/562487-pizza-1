import { createLocalVue, shallowMount } from "@vue/test-utils";
import AppLayoutMainSidebar from "../AppLayoutMainSidebar";
import { setUIComponents } from "@/plugins/ui";

const localVue = createLocalVue();
setUIComponents(localVue);

describe("AppLayoutMainSidebar", () => {
  const stubs = ["router-link"];
  let wrapper;
  const createComponent = (options) => {
    wrapper = shallowMount(AppLayoutMainSidebar, options);
  };

  const findSidebarLinks = () => wrapper.findAll("[data-test='sidebar-link']");

  afterEach(() => {
    wrapper.destroy();
  });

  it("renders out main sidebar layout", () => {
    createComponent({ localVue, stubs });
    expect(wrapper.exists()).toBe(true);
  });

  it("renders out sidebar links", () => {
    createComponent({ localVue, stubs });
    expect(findSidebarLinks()).toHaveLength(wrapper.vm.links.length);
  });
});
