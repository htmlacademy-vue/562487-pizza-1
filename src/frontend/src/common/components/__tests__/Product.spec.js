import { createLocalVue, mount } from "@vue/test-utils";
import Vuex from "vuex";
import { generateMockStore } from "@/store/mocks";
import Product from "@/common/components/Product";
import pizzaData from "@/static/pizza.json";
import { setLoadData } from "@/store/mocks/setters";

const localVue = createLocalVue();
localVue.use(Vuex);

describe("Product", () => {
  const textSelector = "[data-test='product-text']";
  const titleSelector = "[data-test='product-text-title']";
  const listSelector = "[data-test='product-text-list']";
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
    wrapper = mount(Product, options);
  };

  beforeEach(() => {
    store = generateMockStore();
    setLoadData(store);
  });

  afterEach(() => {
    wrapper.destroy();
  });

  it("it renders product", () => {
    createComponent({ localVue, store, propsData });
    expect(wrapper.exists()).toBe(true);
  });

  it("it renders product image", () => {
    createComponent({ localVue, store, propsData });
    const image = wrapper.find("img");
    expect(image.exists()).toBe(true);
  });

  it("product image's alt text is prop pizza name", () => {
    createComponent({ localVue, store, propsData });
    const image = wrapper.find("img");
    expect(image.element.alt).toBe(propsData.pizza.name);
  });

  it("it renders product text", () => {
    createComponent({ localVue, store, propsData });
    expect(wrapper.find(textSelector).exists()).toBe(true);
    expect(wrapper.find(titleSelector).exists()).toBe(true);
    expect(wrapper.find(listSelector).exists()).toBe(true);
  });

  it("product title contains prop pizza name", () => {
    createComponent({ localVue, store, propsData });
    const title = wrapper.find(titleSelector);
    expect(title.text()).toBe(propsData.pizza.name);
  });

  it("product list contains prop pizza size display name", () => {
    const sizeDisplayName = size.name;
    createComponent({ localVue, store, propsData });
    const listText = wrapper.find(listSelector).text();
    expect(listText.includes(sizeDisplayName)).toBe(true);
  });

  it("product list contains prop pizza dough display name", () => {
    const doughDisplayName = dough.name.replace(/.$/, "м").toLowerCase();
    createComponent({ localVue, store, propsData });
    const listText = wrapper.find(listSelector).text();
    expect(listText.includes(doughDisplayName)).toBe(true);
  });

  it("product list contains prop pizza sauce display name", () => {
    const sauceDisplayName = sauce.name.toLowerCase();
    createComponent({ localVue, store, propsData });
    const listText = wrapper.find(listSelector).text();
    expect(listText.includes(sauceDisplayName)).toBe(true);
  });

  it("product list contains prop pizza ingredients display name", () => {
    const displayName = Array.from(new Set(ingredientsDisplayNames)).join(", ");
    createComponent({ localVue, store, propsData });
    const listText = wrapper.find(listSelector).text();
    expect(listText.includes(displayName)).toBe(true);
  });
});
