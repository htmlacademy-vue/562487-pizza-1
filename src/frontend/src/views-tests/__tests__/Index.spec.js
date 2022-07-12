import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuex from "vuex";
import { generateMockStore } from "@/store/mocks";
import Index from "@/views/Index.vue";
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
  let mutations;
  let store;
  let wrapper;
  const createComponent = (options) => {
    wrapper = shallowMount(Index, options);
  };

  const findBuilderForm = () => wrapper.findComponent({ name: "BuilderForm" });
  const findBuilderPopup = () =>
    wrapper.findComponent({ name: "BuilderPopup" });

  const showBuilderPopup = async () => {
    const nextRoute = "/cart";
    const nextFn = jest.fn();
    Index.beforeRouteLeave.call(
      wrapper.vm,
      { path: nextRoute },
      { path: "/" },
      nextFn
    );
    await nextTick();
  };

  beforeEach(() => {
    mocks.$router.push = jest.fn();
    store = generateMockStore();
  });

  afterEach(() => {
    wrapper.destroy();
  });

  describe("index view", () => {
    it("renders out index view", () => {
      createComponent({ localVue, store, stubs, mocks });
      expect(wrapper.exists()).toBe(true);
    });

    it("renders out builder", () => {
      createComponent({ localVue, store, stubs, mocks });
      const builder = findBuilderForm();
      expect(builder.exists()).toBe(true);
      expect(builder.props().isEditMode).toBe(false);
    });

    it("renders out builder in edit mode", () => {
      mocks.$route.params.id = testCartPizza.id;
      setCartPizzas(store, [testCartPizza]);
      createComponent({ localVue, store, stubs, mocks });
      const builder = findBuilderForm();
      expect(builder.exists()).toBe(true);
      expect(builder.props().isEditMode).toBe(true);
    });

    it("switches off edit mode when builder emits saveEdit", async () => {
      mocks.$route.params.id = testCartPizza.id;
      setCartPizzas(store, [testCartPizza]);
      createComponent({ localVue, store, stubs, mocks });
      const builder = findBuilderForm();
      expect(builder.props().isEditMode).toBe(true);
      builder.vm.$emit("saveEdit");
      await nextTick();
      expect(builder.props().isEditMode).toBe(false);
    });

    it("does not renders out builder popup", () => {
      mocks.$route.params.id = testCartPizza.id;
      setCartPizzas(store, [testCartPizza]);
      createComponent({ localVue, store, stubs, mocks });
      expect(findBuilderPopup().exists()).toBe(false);
    });
  });

  describe("when created with route params id", () => {
    it("calls vuex mutation to set pizza", async () => {
      mocks.$route.params.id = testCartPizza.id;
      mutations = {
        Builder: {
          SET_BUILDER_ENTITY: jest.fn(),
        },
      };
      store = generateMockStore({ mutations });
      setCartPizzas(store, [testCartPizza]);
      createComponent({ localVue, store, stubs, mocks });
      expect(mutations.Builder.SET_BUILDER_ENTITY).toHaveBeenCalled();
    });

    it("sets state builder pizza", async () => {
      mocks.$route.params.id = testCartPizza.id;
      setCartPizzas(store, [testCartPizza]);
      createComponent({ localVue, store, stubs, mocks });
      expect(store.state.Builder.pizza).toEqual(testCartPizza);
    });

    it("pushes index route without params when no pizza in cart", () => {
      mocks.$route.params.id = "randomId";
      setCartPizzas(store, [testCartPizza]);
      createComponent({ localVue, store, stubs, mocks });
      expect(wrapper.vm.isEditMode).toBe(false);
      expect(mocks.$router.push).toHaveBeenCalledWith("/");
    });
  });

  describe("builder popup", () => {
    it("renders out popup before we update the route when edit", async () => {
      const nextRoute = "/cart";
      const nextFn = jest.fn();
      mocks.$route.params.id = testCartPizza.id;
      setCartPizzas(store, [testCartPizza]);
      createComponent({ localVue, store, stubs, mocks });
      expect(findBuilderPopup().exists()).toBe(false);
      Index.beforeRouteUpdate.call(
        wrapper.vm,
        { path: nextRoute },
        { path: "/" },
        nextFn
      );
      await nextTick();
      expect(findBuilderPopup().exists()).toBe(true);
    });

    it("renders out popup before we leave the route when edit", async () => {
      const nextRoute = "/cart";
      const nextFn = jest.fn();
      mocks.$route.params.id = testCartPizza.id;
      setCartPizzas(store, [testCartPizza]);
      createComponent({ localVue, store, stubs, mocks });
      expect(findBuilderPopup().exists()).toBe(false);
      Index.beforeRouteLeave.call(
        wrapper.vm,
        { path: nextRoute },
        { path: "/" },
        nextFn
      );
      await nextTick();
      expect(findBuilderPopup().exists()).toBe(true);
    });

    it("closes popup when it emits save", async () => {
      mocks.$route.params.id = testCartPizza.id;
      setCartPizzas(store, [testCartPizza]);
      createComponent({ localVue, store, stubs, mocks });
      await showBuilderPopup();
      const builderPopup = findBuilderPopup();
      builderPopup.vm.$emit("save");
      await nextTick();
      expect(builderPopup.exists()).toBe(false);
    });

    it("calls vuex mutation when popup emits save", async () => {
      mutations = {
        Cart: {
          UPDATE_PIZZA: jest.fn(),
        },
      };
      store = generateMockStore({ mutations });
      mocks.$route.params.id = testCartPizza.id;
      setCartPizzas(store, [testCartPizza]);
      createComponent({ localVue, store, stubs, mocks });
      await showBuilderPopup();
      findBuilderPopup().vm.$emit("save");
      await nextTick();
      expect(mutations.Cart.UPDATE_PIZZA).toHaveBeenCalled();
    });

    it("goes to next route when popup emits save", async () => {
      jest.useFakeTimers();
      jest.spyOn(global, "setTimeout");
      mocks.$route.params.id = testCartPizza.id;
      const nextRoute = "/cart";
      setCartPizzas(store, [testCartPizza]);
      createComponent({ localVue, store, stubs, mocks });
      await showBuilderPopup();
      findBuilderPopup().vm.$emit("save");
      await nextTick();
      expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 500);
      jest.runAllTimers();
      expect(mocks.$router.push).toHaveBeenCalledWith(nextRoute);
    });
  });
});
