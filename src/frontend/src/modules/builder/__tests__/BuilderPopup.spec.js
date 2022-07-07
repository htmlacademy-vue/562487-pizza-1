import { createLocalVue, mount } from "@vue/test-utils";
import { nextTick } from "vue";
import BuilderPopup from "../components/BuilderPopup";
import { setUIComponents } from "@/plugins/ui";

const localVue = createLocalVue();
setUIComponents(localVue);

describe("BuilderPopup", () => {
  let wrapper;
  const createComponent = (options) => {
    wrapper = mount(BuilderPopup, options);
  };

  const findPopupLayout = () => wrapper.findComponent({ name: "PopupLayout" });
  const findSaveButton = () => wrapper.find("[data-test='save-btn'] a");
  const findCancelButton = () => wrapper.find("[data-test='cancel-btn'] a");
  const findFocused = () => wrapper.find("a:focus");

  afterEach(() => {
    wrapper.destroy();
  });

  it("renders out builder popup", () => {
    createComponent({ localVue });
    expect(wrapper.exists()).toBe(true);
  });

  it("renders out popup layout", () => {
    createComponent({ localVue });
    expect(findPopupLayout().exists()).toBe(true);
  });

  it("renders out save button", () => {
    createComponent({ localVue });
    expect(findSaveButton().exists()).toBe(true);
  });

  it("renders out cancel button", () => {
    createComponent({ localVue });
    expect(findCancelButton().exists()).toBe(true);
  });

  it("renders out with save button focused", () => {
    const div = document.createElement("div");
    div.id = "root";
    document.body.appendChild(div);
    createComponent({ localVue, attachTo: "#root" });
    const focusedBtn = findFocused();
    expect(focusedBtn.exists()).toBe(true);
    expect(focusedBtn.element).toBe(findSaveButton().element);
  });

  it("emits close on popup layout close", async () => {
    createComponent({ localVue });
    findPopupLayout().vm.$emit("close");
    await nextTick();
    expect(wrapper.emitted().close).toBeTruthy();
  });

  it("emits save on save button click", async () => {
    createComponent({ localVue });
    findSaveButton().trigger("click");
    await nextTick();
    expect(wrapper.emitted().save).toBeTruthy();
  });

  it("emits cancel on cancel button click", async () => {
    createComponent({ localVue });
    findCancelButton().trigger("click");
    await nextTick();
    expect(wrapper.emitted().cancel).toBeTruthy();
  });
});
