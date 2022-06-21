import { createLocalVue, mount } from "@vue/test-utils";
import CartPopup from "../components/CartPopup";
import { setUIComponents } from "@/plugins/ui";
import PopupLayout from "@/common/components/PopupLayout";

const localVue = createLocalVue();
setUIComponents(localVue);

describe("CartPopup", () => {
  const okBtnSelector = "[data-test='ok-button'] a";
  let wrapper;
  const createComponent = (options) => {
    wrapper = mount(CartPopup, options);
  };

  afterEach(() => {
    wrapper.destroy();
  });

  it("renders out cart popup", () => {
    createComponent({ localVue });
    expect(wrapper.exists()).toBe(true);
  });

  it("renders out with ok button focused", () => {
    const div = document.createElement("div");
    div.id = "root";
    document.body.appendChild(div);
    createComponent({ localVue, attachTo: "#root" });
    const focusedBtn = wrapper.find("a:focus");
    const okBtn = wrapper.find(okBtnSelector);
    expect(focusedBtn.exists()).toBe(true);
    expect(focusedBtn.element).toBe(okBtn.element);
  });

  it("emits close on popup layout close", () => {
    createComponent({ localVue });
    const popupLayout = wrapper.findComponent(PopupLayout);
    popupLayout.vm.$emit("close");
    expect(wrapper.emitted().close).toBeTruthy();
  });

  it("emits close on ok button click", async () => {
    createComponent({ localVue });
    const okBtn = wrapper.find(okBtnSelector);
    await okBtn.trigger("click");
    expect(wrapper.emitted().close).toBeTruthy();
  });

  it("renders out ok button with ok ref", () => {
    createComponent({ localVue });
    const okBtn = wrapper.findComponent({ ref: "ok" });
    expect(okBtn.exists()).toBe(true);
  });
});
