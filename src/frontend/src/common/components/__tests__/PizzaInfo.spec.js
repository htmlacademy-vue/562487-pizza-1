import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuex from "vuex";
import { generateMockStore } from "@/store/mocks";
import PizzaInfo from "@/common/components/PizzaInfo";
import pizzaData from "@/static/pizza.json";
import { setLoadData } from "@/store/mocks/setters";

const localVue = createLocalVue();
localVue.use(Vuex);

describe("PizzaInfo", () => {
  const dough = pizzaData.dough[0];
  const sauce = pizzaData.sauces[0];
  const size = pizzaData.sizes[0];
  const ingredients = pizzaData.ingredients.slice(0, 1);
  const ingredientsDisplayNames = ingredients.map((it) =>
    it.name.toLowerCase()
  );
  const propsData = {
    pizza: {
      id: 1,
      name: "Pizza",
      doughId: dough.id,
      sauceId: sauce.id,
      sizeId: size.id,
      ingredients: ingredients.map((it) => ({
        ingredientId: it.id,
        quantity: 1,
      })),
    },
  };

  let store;
  let wrapper;
  const createComponent = (options) => {
    wrapper = shallowMount(PizzaInfo, options);
  };

  const findProductText = () => wrapper.find("[data-test='product-text']");
  const findTitle = () => wrapper.find("[data-test='product-text-title']");
  const findList = () => wrapper.find("[data-test='product-text-list']");

  beforeEach(() => {
    store = generateMockStore();
    setLoadData(store);
  });

  afterEach(() => {
    wrapper.destroy();
  });

  it("it renders pizza info", () => {
    createComponent({ localVue, store, propsData });
    expect(wrapper.exists()).toBe(true);
  });

  it("it renders pizza image", () => {
    createComponent({ localVue, store, propsData });
    const image = wrapper.find("img");
    expect(image.exists()).toBe(true);
  });

  it("pizza image's alt text is prop pizza name", () => {
    createComponent({ localVue, store, propsData });
    const image = wrapper.find("img");
    expect(image.element.alt).toBe(propsData.pizza.name);
  });

  it("it renders pizza info text", () => {
    createComponent({ localVue, store, propsData });
    expect(findProductText().exists()).toBe(true);
    expect(findTitle().exists()).toBe(true);
    expect(findList().exists()).toBe(true);
  });

  it("pizza info title contains prop pizza name", () => {
    createComponent({ localVue, store, propsData });
    expect(findTitle().text()).toBe(propsData.pizza.name);
  });

  it("pizza info list contains prop pizza size display name", () => {
    const sizeDisplayName = size.name;
    createComponent({ localVue, store, propsData });
    expect(findList().text().includes(sizeDisplayName)).toBe(true);
  });

  it("pizza info list contains prop pizza dough display name", () => {
    const doughDisplayName = dough.name.replace(/.$/, "м").toLowerCase();
    createComponent({ localVue, store, propsData });
    expect(findList().text().includes(doughDisplayName)).toBe(true);
  });

  it("pizza info list contains prop pizza sauce display name", () => {
    const sauceDisplayName = sauce.name.toLowerCase();
    createComponent({ localVue, store, propsData });
    expect(findList().text().includes(sauceDisplayName)).toBe(true);
  });

  it("pizza info list contains prop pizza ingredients display name", () => {
    const displayName = Array.from(new Set(ingredientsDisplayNames)).join(", ");
    createComponent({ localVue, store, propsData });
    expect(findList().text().includes(displayName)).toBe(true);
  });
});
