import { shallowMount } from "@vue/test-utils";
import AppDrag from "@/common/components/AppDrag";
import pizzaData from "@/static/pizza.json";
import { Ingredient } from "@/common/models";

describe("AppDrag", () => {
  const propsData = {
    transferData: new Ingredient(pizzaData.ingredients[0]),
    isDraggable: true,
  };
  const slots = { default: "content" };

  let wrapper;
  const createComponent = (options) => {
    wrapper = shallowMount(AppDrag, options);
  };

  afterEach(() => {
    wrapper.destroy();
  });

  it("renders out the slot content", () => {
    createComponent({ slots, propsData });
    expect(wrapper.html()).toContain(slots.default);
  });

  it("renders draggable content", () => {
    createComponent({ slots, propsData });
    expect(wrapper.attributes().draggable).toBe(
      propsData.isDraggable.toString()
    );
  });

  it("renders undraggable content", () => {
    const notDraggable = false;
    createComponent({
      slots,
      propsData: { ...propsData, isDraggable: notDraggable },
    });
    expect(wrapper.attributes().draggable).toBe(notDraggable.toString());
  });
});
