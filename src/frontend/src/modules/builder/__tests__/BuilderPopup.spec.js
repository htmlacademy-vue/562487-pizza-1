import { createLocalVue, mount } from "@vue/test-utils";
import BuilderPopup from "../components/BuilderPopup";
import { setUIComponents } from "@/plugins/ui";
import PopupLayout from "@/common/components/PopupLayout";

const localVue = createLocalVue();
setUIComponents(localVue);

describe("BuilderPopup", () => {
  const saveBtnSelector = "[data-test='save-btn'] a";
  const cancelBtnSelector = "[data-test='cancel-btn'] a";
  let wrapper;
  const createComponent = (options) => {
    wrapper = mount(BuilderPopup, options);
  };

  afterEach(() => {
    wrapper.destroy();
  });

  it("renders out builder popup", () => {
    createComponent({ localVue });
    expect(wrapper.exists()).toBe(true);
  });

  it("renders out with save button focused", () => {
    const div = document.createElement("div");
    div.id = "root";
    document.body.appendChild(div);
    createComponent({ localVue, attachTo: "#root" });
    const focusedBtn = wrapper.find("a:focus");
    const saveBtn = wrapper.find(saveBtnSelector);
    expect(focusedBtn.exists()).toBe(true);
    expect(focusedBtn.element).toBe(saveBtn.element);
  });

  it("emits close on popup layout close", () => {
    createComponent({ localVue });
    const popupLayout = wrapper.findComponent(PopupLayout);
    popupLayout.vm.$emit("close");
    expect(wrapper.emitted().close).toBeTruthy();
  });

  it("emits save on save button click", async () => {
    createComponent({ localVue });
    const saveBtn = wrapper.find(saveBtnSelector);
    await saveBtn.trigger("click");
    expect(wrapper.emitted().save).toBeTruthy();
  });

  it("emits cancel on cancel button click", async () => {
    createComponent({ localVue });
    const cancelBtn = wrapper.find(cancelBtnSelector);
    await cancelBtn.trigger("click");
    expect(wrapper.emitted().cancel).toBeTruthy();
  });

  it("renders out save button with save ref", () => {
    createComponent({ localVue });
    const saveBtn = wrapper.findComponent({ ref: "save" });
    expect(saveBtn.exists()).toBe(true);
  });
});
