import { shallowMount } from "@vue/test-utils";
import AppNotifications from "@/common/components/AppNotifications";

describe("AppNotifications", () => {
  const notificationData = { id: 1, text: "text", type: "warning" };
  const mocks = {
    $store: {
      state: {
        notifications: [],
      },
    },
    $notifier: {
      close: null,
    },
  };

  let wrapper;
  const createComponent = (options) => {
    wrapper = shallowMount(AppNotifications, options);
  };

  const findNotifications = () => wrapper.find("[data-test='notifications']");
  const findNotification = () => wrapper.find(".notification");
  const findCloseBtn = () => wrapper.find(".close");

  beforeEach(() => {
    mocks.$notifier.close = jest.fn();
  });

  afterEach(() => {
    wrapper.destroy();
    mocks.$store.state.notifications = [];
  });

  it("doesn't render out when no notifications", () => {
    createComponent({ mocks });
    expect(findNotifications().exists()).toBe(false);
  });

  it("renders out when there are some notifications", () => {
    mocks.$store.state.notifications.push(notificationData);
    createComponent({ mocks });
    expect(wrapper.html()).toBeTruthy();
  });

  it("renders out notification", () => {
    const notificationClassName = "notification--" + notificationData.type;
    mocks.$store.state.notifications.push(notificationData);
    createComponent({ mocks });
    const notification = findNotification();
    expect(notification.classes()).toContain(notificationClassName);
    expect(notification.text()).toContain(notificationData.text);
  });

  it("render out close button", () => {
    mocks.$store.state.notifications.push(notificationData);
    createComponent({ mocks });
    expect(findCloseBtn().exists()).toBe(true);
  });

  it("calls $notifier.close with id on close button click", async () => {
    mocks.$store.state.notifications.push(notificationData);
    createComponent({ mocks });
    await findCloseBtn().trigger("click");
    expect(mocks.$notifier.close).toHaveBeenCalledWith(notificationData.id);
  });
});
