import { shallowMount, RouterLinkStub } from "@vue/test-utils";
import SidebarLink from "@/common/components/SidebarLink";

describe("SidebarLink", () => {
  const stubs = {
    "router-link": RouterLinkStub,
  };
  const propsData = {
    link: {
      to: "/profile",
      pathName: "Profile",
      title: "Мои данные",
    },
  };
  let wrapper;
  const createComponent = (options) => {
    wrapper = shallowMount(SidebarLink, options);
  };

  const findLink = () => wrapper.findComponent(RouterLinkStub);

  afterEach(() => {
    wrapper.destroy();
  });

  it("it renders sidebar link", () => {
    createComponent({ stubs, propsData });
    expect(wrapper.exists()).toBe(true);
  });

  it("link to prop link to", () => {
    createComponent({ stubs, propsData });
    expect(findLink().props().to).toBe(propsData.link.to);
  });

  it("link text is prop link title", () => {
    createComponent({ stubs, propsData });
    expect(findLink().text()).toBe(propsData.link.title);
  });
});
