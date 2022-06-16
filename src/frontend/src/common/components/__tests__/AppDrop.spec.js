import { shallowMount } from "@vue/test-utils";
import AppDrop from "@/common/components/AppDrop";

describe("AppDrop", () => {
  const slots = { default: "content" };
  const transferData = {
    id: 1,
  };

  let wrapper;
  const createComponent = (options) => {
    wrapper = shallowMount(AppDrop, options);
  };

  afterEach(() => {
    wrapper.destroy();
  });

  it("renders out the slot content", () => {
    createComponent({ slots });
    expect(wrapper.html()).toContain(slots.default);
  });

  it("emits drop on drop stop", async () => {
    createComponent({ slots });
    await wrapper.trigger("drop.stop", {
      dataTransfer: {
        getData: () => JSON.stringify(transferData),
      },
    });
    expect(wrapper.emitted().drop).toBeTruthy();
    expect(wrapper.emitted().drop[0][0].id).toBe(transferData.id);
  });
});
