import { NotificationTypes } from "@/common/enums";
import { generate } from "@/common/helpers";

export default class Notifier {
  #store;
  constructor(store) {
    this.#store = store;
  }

  info(text) {
    this.#store.dispatch(
      "createNotification",
      generate({
        text,
        type: NotificationTypes.INFO,
      })
    );
  }

  success(text) {
    this.#store.dispatch(
      "createNotification",
      generate({
        text,
        type: NotificationTypes.SUCCESS,
      })
    );
  }

  error(text) {
    this.#store.dispatch(
      "createNotification",
      generate({
        text,
        type: NotificationTypes.ERROR,
      })
    );
  }

  warning(text) {
    this.#store.dispatch(
      "createNotification",
      generate({
        text,
        type: NotificationTypes.WARNING,
      })
    );
  }

  close(id) {
    this.#store.dispatch("deleteNotification", id);
  }
}
