import { createLocalVue, mount } from "@vue/test-utils";
import Vuex from "vuex";
import { generateMockStore } from "@/store/mocks";
import Builder from "../components/Builder";
import { testPizza, setPizza } from "@/store/mocks/setters";
import { setUIComponents } from "@/plugins/ui";

const localVue = createLocalVue();
localVue.use(Vuex);
setUIComponents(localVue);

describe("Builder", () => {
  const propsData = {
    isEditMode: false,
  };
  const mocks = {
    $router: {
      push: jest.fn(),
    },
    $notifier: {
      success: jest.fn(),
    },
  };
  let store;
  let wrapper;
  const createComponent = (options) => {
    wrapper = mount(Builder, options);
  };

  beforeEach(() => {
    store = generateMockStore();
    setPizza(store);
  });

  afterEach(() => {
    wrapper.destroy();
  });

  it("renders out builder form", () => {
    createComponent({ localVue, store, propsData });
    expect(wrapper.exists()).toBe(true);
  });

  it("pizza name input value is state builder pizza name", () => {
    createComponent({ localVue, store, propsData });
    const nameInput = wrapper.find("[name='pizza_name']");
    expect(nameInput.element.value).toBe(testPizza.name);
  });

  it("calls vuex mutation on pizza name input", async () => {
    const pizzaName = "Pizzzka";
    createComponent({ localVue, store, propsData });
    const spyOnSetName = jest.spyOn(wrapper.vm, "setPizzaEntity");
    const nameInput = wrapper.find("[name='pizza_name']");
    nameInput.element.value = pizzaName;
    await nameInput.trigger("input");
    expect(spyOnSetName).toHaveBeenCalledWith({
      entity: "name",
      value: pizzaName,
    });
  });

  it("calls vuex mutation addPizza on submit", async () => {
    createComponent({ localVue, store, mocks, propsData });
    const spyOnAddPizza = jest.spyOn(wrapper.vm, "addPizza");
    await wrapper.trigger("submit");
    expect(spyOnAddPizza).toHaveBeenCalledWith(testPizza);
  });

  it("calls vuex mutation updatePizza on submit when prop isEditMode", async () => {
    createComponent({
      localVue,
      store,
      mocks,
      propsData: { ...propsData, isEditMode: true },
    });
    const spyOnAddPizza = jest.spyOn(wrapper.vm, "updatePizza");
    await wrapper.trigger("submit");
    expect(spyOnAddPizza).toHaveBeenCalledWith(testPizza);
  });

  it("emits saveEdit on submit when prop isEditMode", async () => {
    createComponent({
      localVue,
      store,
      mocks,
      propsData: { ...propsData, isEditMode: true },
    });
    await wrapper.trigger("submit");
    expect(wrapper.emitted().saveEdit).toBeTruthy();
  });

  it("emits router push on submit when prop isEditMode", async () => {
    createComponent({
      localVue,
      store,
      mocks,
      propsData: { ...propsData, isEditMode: true },
    });
    await wrapper.trigger("submit");
    expect(mocks.$router.push).toHaveBeenCalledWith("/cart");
  });

  it("calls notifier plugin success message on submit", async () => {
    const message = `Пицца ${testPizza.name} создана`;
    createComponent({ localVue, store, mocks, propsData });
    await wrapper.trigger("submit");
    expect(mocks.$notifier.success).toHaveBeenCalledWith(message);
  });

  it("calls vuex mutation resetPizza on submit", async () => {
    createComponent({ localVue, store, mocks, propsData });
    const spyOnResetPizza = jest.spyOn(wrapper.vm, "resetPizza");
    await wrapper.trigger("submit");
    expect(spyOnResetPizza).toHaveBeenCalled();
  });
});
