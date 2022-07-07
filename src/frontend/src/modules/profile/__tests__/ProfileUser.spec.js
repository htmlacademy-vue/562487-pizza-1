import { createLocalVue, mount } from "@vue/test-utils";
import Vuex from "vuex";
import { generateMockStore } from "@/store/mocks";
import ProfileUser from "../components/ProfileUser";
import { setUIComponents } from "@/plugins/ui";
import { setUser } from "@/store/mocks/setters";

const localVue = createLocalVue();
localVue.use(Vuex);
setUIComponents(localVue);

describe("ProfileUser", () => {
  let store;
  let wrapper;
  const createComponent = (options) => {
    wrapper = mount(ProfileUser, options);
  };

  const findUserPicture = () => wrapper.findComponent({ name: "UserPicture" });
  const findUserName = () => wrapper.find("[data-test='user-name']");
  const findUserPhone = () => wrapper.find("[data-test='user-phone']");

  beforeEach(() => {
    store = generateMockStore();
    setUser(store);
  });

  afterEach(() => {
    wrapper.destroy();
  });

  it("renders out profile user", () => {
    createComponent({ localVue, store });
    expect(wrapper.exists()).toBe(true);
  });

  it("renders out state user picture", () => {
    createComponent({ localVue, store });
    expect(findUserPicture().exists()).toBe(true);
  });

  it("renders out state user name", () => {
    createComponent({ localVue, store });
    const { name } = store.state.Auth.user;
    const userName = findUserName();
    expect(userName.exists()).toBe(true);
    expect(userName.text()).toBe(name);
  });

  it("renders out state user phone", () => {
    createComponent({ localVue, store });
    const { phone } = store.state.Auth.user;
    const userPhone = findUserPhone();
    expect(userPhone.exists()).toBe(true);
    expect(userPhone.text()).toContain(phone);
  });
});
