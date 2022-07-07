import { createLocalVue, mount } from "@vue/test-utils";
import { nextTick } from "vue";
import CartPopup from "../components/CartPopup";
import { setUIComponents } from "@/plugins/ui";

const localVue = createLocalVue();
setUIComponents(localVue);

describe("CartPopup", () => {
  let wrapper;
  const createComponent = (options) => {
    wrapper = mount(CartPopup, options);
  };

  afterEach(() => {
    wrapper.destroy();
  });

  const findOkBtn = () => wrapper.find("[data-test='ok-button'] a");
  const findPopupLayout = () => wrapper.findComponent({ name: "PopupLayout" });

  it("renders out cart popup", () => {
    createComponent({ localVue });
    expect(wrapper.exists()).toBe(true);
  });

  it("renders out with ok button focused", () => {
    const div = document.createElement("div");
    div.id = "root";
    document.body.appendChild(div);
    wrapper = mount(CartPopup, { localVue, attachTo: "#root" });
    const focusedBtn = wrapper.find("a:focus");
    const okBtn = findOkBtn();
    expect(focusedBtn.exists()).toBe(true);
    expect(focusedBtn.element).toBe(okBtn.element);
  });

  it("emits close on popup layout close", async () => {
    createComponent({ localVue });
    findPopupLayout().vm.$emit("close");
    await nextTick();
    expect(wrapper.emitted().close).toBeTruthy();
  });

  it("emits close on ok button click", async () => {
    createComponent({ localVue });
    findOkBtn().trigger("click");
    await nextTick();
    expect(wrapper.emitted().close).toBeTruthy();
  });
});
