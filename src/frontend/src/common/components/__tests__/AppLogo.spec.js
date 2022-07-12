import { shallowMount, RouterLinkStub } from "@vue/test-utils";
import AppLogo from "@/common/components/AppLogo";

describe("AppLogo", () => {
  const stubs = {
    "router-link": RouterLinkStub,
  };
  let wrapper;
  const createComponent = (options) => {
    wrapper = shallowMount(AppLogo, options);
  };

  afterEach(() => {
    wrapper.destroy();
  });

  it("it renders logo", () => {
    createComponent({ stubs });
    expect(wrapper.exists()).toBe(true);
  });

  it("it renders router link to root route", () => {
    createComponent({ stubs });
    const routerLink = wrapper.findComponent(RouterLinkStub);
    expect(routerLink.props().to).toBe("/");
  });

  it("it renders logo image", () => {
    createComponent({ stubs });
    expect(wrapper.find("img").exists()).toBe(true);
  });
});
