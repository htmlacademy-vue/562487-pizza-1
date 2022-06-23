import { createLocalVue, mount } from "@vue/test-utils";
import Vuex from "vuex";
import { generateMockStore } from "@/store/mocks";
import ProfileUser from "../components/ProfileUser";
import UserPicture from "@/common/components/UserPicture";
import { setUIComponents } from "@/plugins/ui";
import { setUser, testUser } from "@/store/mocks/setters";

const localVue = createLocalVue();
localVue.use(Vuex);
setUIComponents(localVue);

describe("ProfileUser", () => {
  let store;
  let wrapper;
  const createComponent = (options) => {
    wrapper = mount(ProfileUser, options);
  };

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
    const userPicture = wrapper.findComponent(UserPicture);
    expect(userPicture.exists()).toBe(true);
  });

  it("renders out state user name", () => {
    createComponent({ localVue, store });
    const userName = wrapper.find("[data-test='user-name']");
    expect(userName.text()).toBe(testUser.name);
  });

  it("renders out state user phone", () => {
    createComponent({ localVue, store });
    const userPhone = wrapper.find("[data-test='user-phone']");
    expect(userPhone.text()).toContain(testUser.phone);
  });
});
