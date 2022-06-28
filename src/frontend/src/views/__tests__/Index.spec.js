import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuex from "vuex";
import { generateMockStore } from "@/store/mocks";
import Index from "../Index";
import { setUIComponents } from "@/plugins/ui";
import { setCartPizzas, testCartPizza } from "@/store/mocks/setters";
import { nextTick } from "vue";

const localVue = createLocalVue();
localVue.use(Vuex);
setUIComponents(localVue);

describe("Index", () => {
  const stubs = ["router-view"];
  const mocks = {
    $route: {
      params: {},
    },
    $router: {
      push: jest.fn(),
    },
  };
  let store;
  let wrapper;
  const createComponent = (options) => {
    wrapper = shallowMount(Index, options);
  };

  beforeEach(() => {
    mocks.$router.push = jest.fn();
    store = generateMockStore();
  });

  afterEach(() => {
    wrapper.destroy();
  });

  it("renders out index view", () => {
    createComponent({ localVue, store, stubs, mocks });
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.vm.isEditMode).toBe(false);
  });

  it("renders out in edit mode when created with route params id", () => {
    mocks.$route.params.id = testCartPizza.id;
    setCartPizzas(store, [testCartPizza]);
    createComponent({ localVue, store, stubs, mocks });
    expect(wrapper.vm.isEditMode).toBe(true);
  });

  it("calls vuex mutation to set pizza when created with route params id", async () => {
    mocks.$route.params.id = testCartPizza.id;
    setCartPizzas(store, [testCartPizza]);
    createComponent({ localVue, store, stubs, mocks });
    const spyOnMutation = jest.spyOn(wrapper.vm, "setBuilderEntity");
    Index.created.call(wrapper.vm);
    expect(spyOnMutation).toHaveBeenCalledWith({
      entity: "pizza",
      value: testCartPizza,
    });
  });

  it("pushes index route without params when created with route params id but no pizza in cart", () => {
    mocks.$route.params.id = "randomId";
    setCartPizzas(store, [testCartPizza]);
    createComponent({ localVue, store, stubs, mocks });
    expect(wrapper.vm.isEditMode).toBe(false);
    expect(mocks.$router.push).toHaveBeenCalledWith("/");
  });

  it("renders out builder", () => {
    createComponent({ localVue, store, stubs, mocks });
    const builder = wrapper.findComponent({ name: "Builder" });
    expect(builder.exists()).toBe(true);
  });

  it("switches off edit mode when builder emits saveEdit", () => {
    mocks.$route.params.id = testCartPizza.id;
    setCartPizzas(store, [testCartPizza]);
    createComponent({ localVue, store, stubs, mocks });
    expect(wrapper.vm.isEditMode).toBe(true);
    const builder = wrapper.findComponent({ name: "Builder" });
    builder.vm.$emit("saveEdit");
    expect(wrapper.vm.isEditMode).toBe(false);
  });

  it("does not renders out builder popup", () => {
    mocks.$route.params.id = testCartPizza.id;
    setCartPizzas(store, [testCartPizza]);
    createComponent({ localVue, store, stubs, mocks });
    const builderPopup = wrapper.findComponent({ name: "BuilderPopup" });
    expect(builderPopup.exists()).toBe(false);
    expect(wrapper.vm.isPopupShowed).toBe(false);
  });

  it("renders out builder popup when isPopupShowed", async () => {
    mocks.$route.params.id = testCartPizza.id;
    setCartPizzas(store, [testCartPizza]);
    createComponent({ localVue, store, stubs, mocks });
    await wrapper.setData({
      isPopupShowed: true,
    });
    const builderPopup = wrapper.findComponent({ name: "BuilderPopup" });
    expect(builderPopup.exists()).toBe(true);
  });

  it("renders out builder popup before we update the route when edit", async () => {
    const nextRoute = "/cart";
    const nextFn = jest.fn();
    mocks.$route.params.id = testCartPizza.id;
    setCartPizzas(store, [testCartPizza]);
    createComponent({ localVue, store, stubs, mocks });
    Index.beforeRouteUpdate.call(
      wrapper.vm,
      { path: nextRoute },
      { path: "/" },
      nextFn
    );
    await nextTick();
    expect(wrapper.vm.isPopupShowed).toBe(true);
    expect(wrapper.vm.routeToLeave).toBe(nextRoute);
  });

  it("renders out builder popup before we leave the route when edit", async () => {
    const nextRoute = "/cart";
    const nextFn = jest.fn();
    mocks.$route.params.id = testCartPizza.id;
    setCartPizzas(store, [testCartPizza]);
    createComponent({ localVue, store, stubs, mocks });
    Index.beforeRouteLeave.call(
      wrapper.vm,
      { path: nextRoute },
      { path: "/" },
      nextFn
    );
    await nextTick();
    expect(wrapper.vm.isPopupShowed).toBe(true);
    expect(wrapper.vm.routeToLeave).toBe(nextRoute);
  });

  it("calls vuex mutation when builder popup emits save", async () => {
    mocks.$route.params.id = testCartPizza.id;
    setCartPizzas(store, [testCartPizza]);
    createComponent({ localVue, store, stubs, mocks });
    const spyOnMutation = jest.spyOn(wrapper.vm, "updatePizza");
    await wrapper.setData({
      isPopupShowed: true,
    });
    const builderPopup = wrapper.findComponent({ name: "BuilderPopup" });
    builderPopup.vm.$emit("save");
    await nextTick();
    expect(spyOnMutation).toHaveBeenCalledWith(testCartPizza);
  });

  it("closes builder popup when it emits save", async () => {
    mocks.$route.params.id = testCartPizza.id;
    setCartPizzas(store, [testCartPizza]);
    createComponent({ localVue, store, stubs, mocks });
    await wrapper.setData({
      isPopupShowed: true,
    });
    const builderPopup = wrapper.findComponent({ name: "BuilderPopup" });
    builderPopup.vm.$emit("save");
    await nextTick();
    expect(wrapper.vm.isPopupShowed).toBe(false);
    expect(wrapper.vm.isEditMode).toBe(false);
  });

  it("goes to next route when builder popup emits save", async () => {
    jest.useFakeTimers();
    jest.spyOn(global, "setTimeout");
    mocks.$route.params.id = testCartPizza.id;
    const nextRoute = "/cart";
    setCartPizzas(store, [testCartPizza]);
    createComponent({ localVue, store, stubs, mocks });
    await wrapper.setData({
      isPopupShowed: true,
      routeToLeave: nextRoute,
    });
    const builderPopup = wrapper.findComponent({ name: "BuilderPopup" });
    builderPopup.vm.$emit("save");
    await nextTick();
    expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 500);
    jest.runAllTimers();
    expect(mocks.$router.push).toHaveBeenCalledWith(nextRoute);
  });
});
