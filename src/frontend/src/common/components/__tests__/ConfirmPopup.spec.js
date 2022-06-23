import { shallowMount } from "@vue/test-utils";
import ConfirmPopup from "@/common/components/ConfirmPopup";
import PopupLayout from "@/common/components/PopupLayout";
import PopupOverlay from "@/common/components/PopupOverlay";
import PopupButton from "@/common/components/PopupButton";

describe("ConfirmPopup", () => {
  const confirmBtnSelector = "[data-test='confirm-btn'] a";
  const cancelBtnSelector = "[data-test='cancel-btn'] a";
  const propsData = { isSubmitting: true };
  const stubs = {
    PopupLayout,
    PopupOverlay,
    PopupButton,
  };
  const slots = { default: "content" };

  let wrapper;
  const createComponent = (options) => {
    wrapper = shallowMount(ConfirmPopup, options);
  };

  afterEach(() => {
    wrapper.destroy();
  });

  it("renders out the slot content", () => {
    createComponent({ stubs, slots });
    expect(wrapper.html()).toContain(slots.default);
  });

  it("renders out 2 buttons", () => {
    createComponent({ stubs, slots });
    expect(wrapper.find(confirmBtnSelector).exists()).toBe(true);
    expect(wrapper.find(cancelBtnSelector).exists()).toBe(true);
  });

  it("renders out with cancel button focused", () => {
    const div = document.createElement("div");
    div.id = "root";
    document.body.appendChild(div);
    createComponent({ stubs, slots, attachTo: "#root" });
    const cancelBtn = wrapper.find(cancelBtnSelector);
    const focusedBtn = wrapper.find("a:focus");
    expect(focusedBtn.exists()).toBe(true);
    expect(focusedBtn.element).toBe(cancelBtn.element);
  });

  it("emits confirm on confirm button click", async () => {
    createComponent({ stubs });
    const confirmBtn = wrapper.find(confirmBtnSelector);
    await confirmBtn.trigger("click");
    expect(wrapper.emitted().confirm).toBeTruthy();
  });

  it("does not emit confirm on confirm button click when prop isSubmitting", async () => {
    createComponent({ stubs, propsData });
    const confirmBtn = wrapper.find(confirmBtnSelector);
    await confirmBtn.trigger("click");
    expect(wrapper.emitted().confirm).toBeFalsy();
  });

  it("emits cancel on cancel button click", async () => {
    createComponent({ stubs });
    const cancelBtn = wrapper.find(cancelBtnSelector);
    await cancelBtn.trigger("click");
    expect(wrapper.emitted().cancel).toBeTruthy();
  });

  it("emits cancel when popup layout emits close", async () => {
    createComponent({ stubs });
    const overlay = wrapper.find(".overlay");
    await overlay.trigger("click");
    expect(wrapper.emitted().cancel).toBeTruthy();
  });

  it("renders button with cancel ref", () => {
    createComponent({ stubs });
    const btn = wrapper.findComponent({ ref: "cancel" });
    expect(btn.exists()).toBe(true);
  });
});
