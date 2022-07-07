import { createLocalVue, shallowMount } from "@vue/test-utils";
import { nextTick } from "vue";
import ConfirmPopup from "@/common/components/ConfirmPopup";
import PopupButton from "@/common/components/PopupButton";
import { setUIComponents } from "@/plugins/ui";

const localVue = createLocalVue();
setUIComponents(localVue);

describe("ConfirmPopup", () => {
  const propsData = { isSubmitting: true };
  const slots = { default: "content" };
  const stubs = {
    PopupButton,
  };

  let wrapper;
  const createComponent = (options) => {
    wrapper = shallowMount(ConfirmPopup, options);
  };

  const findConfirmBtn = () => wrapper.find("[data-test='confirm-btn'] a");
  const findCancelBtn = () => wrapper.find("[data-test='cancel-btn'] a");
  const findPopupLayout = () => wrapper.findComponent({ name: "PopupLayout" });

  afterEach(() => {
    wrapper.destroy();
  });

  it("renders out the slot content", () => {
    createComponent({ localVue, stubs, slots });
    expect(wrapper.html()).toContain(slots.default);
  });

  it("renders out 2 buttons", () => {
    createComponent({ localVue, stubs, slots });
    expect(findConfirmBtn().exists()).toBe(true);
    expect(findCancelBtn().exists()).toBe(true);
  });

  it("renders out with cancel button focused", () => {
    const div = document.createElement("div");
    div.id = "root";
    document.body.appendChild(div);
    createComponent({ localVue, stubs, slots, attachTo: "#root" });
    const focusedBtn = wrapper.find("a:focus");
    expect(focusedBtn.exists()).toBe(true);
    expect(focusedBtn.element).toBe(findCancelBtn().element);
  });

  it("emits confirm on confirm button click", async () => {
    createComponent({ localVue, stubs });
    await findConfirmBtn().trigger("click");
    expect(wrapper.emitted().confirm).toBeTruthy();
  });

  it("does not emit confirm on confirm button click when prop isSubmitting", async () => {
    createComponent({ localVue, stubs, propsData });
    await findConfirmBtn().trigger("click");
    expect(wrapper.emitted().confirm).toBeFalsy();
  });

  it("emits cancel on cancel button click", async () => {
    createComponent({ localVue, stubs });
    await findCancelBtn().trigger("click");
    expect(wrapper.emitted().cancel).toBeTruthy();
  });

  it("emits cancel when popup layout emits close", async () => {
    createComponent({ localVue, stubs });
    findPopupLayout().vm.$emit("close");
    await nextTick();
    expect(wrapper.emitted().cancel).toBeTruthy();
  });

  it("renders button with cancel ref", () => {
    createComponent({ localVue, stubs });
    const btn = wrapper.findComponent({ ref: "cancel" });
    expect(btn.exists()).toBe(true);
  });
});
