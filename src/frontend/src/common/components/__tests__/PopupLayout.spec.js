import { shallowMount } from "@vue/test-utils";
import PopupLayout from "@/common/components/PopupLayout";
import PopupOverlay from "@/common/components/PopupOverlay";

describe("PopupLayout", () => {
  const stubs = {
    PopupOverlay,
  };
  const slots = { default: "content" };

  let wrapper;
  const createComponent = (options) => {
    wrapper = shallowMount(PopupLayout, options);
  };

  afterEach(() => {
    wrapper.destroy();
  });

  it("renders out the slot content", () => {
    createComponent({ stubs, slots });
    expect(wrapper.html()).toContain(slots.default);
  });

  it("renders close button with close ref", () => {
    createComponent({ stubs });
    const closeBtn = wrapper.findComponent({ ref: "close" });
    expect(closeBtn.exists()).toBe(true);
  });

  it("emits close on close button click", async () => {
    createComponent({ stubs });
    await wrapper.find(".close").trigger("click");
    expect(wrapper.emitted().close.length).toBe(1);
  });

  it("emits close on overlay click", async () => {
    createComponent({ stubs });
    await wrapper.find(".overlay").trigger("click");
    expect(wrapper.emitted().close.length).toBe(1);
  });

  it("emits close on escape keydown", async () => {
    createComponent({ stubs });
    await wrapper.find(".overlay").trigger("keydown.esc");
    expect(wrapper.emitted().close.length).toBe(1);
  });
});
