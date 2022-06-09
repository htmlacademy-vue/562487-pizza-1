import { uniqueId } from "lodash";
import {
  AuthApiService,
  CrudApiService,
  ReadOnlyApiService,
} from "../services/api.service";
import { Resources } from "./enums";

export const generateAvatar = (avatarUrl = "") => ({
  webp: avatarUrl.replace(/.jpg/gi, ".webp"),
  webp2x: avatarUrl.replace(/.jpg/gi, "@2x.webp"),
  webp4x: avatarUrl.replace(/.jpg/gi, "@4x.webp"),
  jpg: avatarUrl,
  jpg2x: avatarUrl.replace(/.jpg/gi, "@2x.jpg"),
  jpg4x: avatarUrl.replace(/.jpg/gi, "@4x.jpg"),
});

export const findByValue = (items, value) => {
  return items.find((it) => it.value === value);
};

export const findById = (items, id) => {
  return items.find((it) => it.id === id);
};

export const findIndexById = (items, id) => {
  return items.findIndex((it) => it.id === id);
};

export const calculateSum = (items) => {
  if (!items.length) {
    return 0;
  }
  return items
    .map((it) => it.price * it.quantity)
    .reduce((acc, it) => acc + it, 0);
};

export const sum = (acc, it) => acc + it;

export const generate = (it) => ({
  id: uniqueId(),
  ...it,
});

export const createResources = (notifier) => {
  return {
    [Resources.ADDRESSES]: new CrudApiService(Resources.ADDRESSES, notifier),
    [Resources.AUTH]: new AuthApiService(notifier),
    [Resources.DOUGH]: new ReadOnlyApiService(Resources.DOUGH, notifier),
    [Resources.INGREDIENTS]: new ReadOnlyApiService(
      Resources.INGREDIENTS,
      notifier
    ),
    [Resources.MISC]: new ReadOnlyApiService(Resources.MISC, notifier),
    [Resources.ORDERS]: new CrudApiService(Resources.ORDERS, notifier),
    [Resources.SAUCES]: new ReadOnlyApiService(Resources.SAUCES, notifier),
    [Resources.SIZES]: new ReadOnlyApiService(Resources.SIZES, notifier),
  };
};

export const setAuth = (store) => {
  store.$api.auth.setAuthHeader();
  store.dispatch("Auth/fetchUser");
};

export const clearAnimations = (el, done) => {
  el.addEventListener(
    "animationend",
    () => {
      el.style = "";
      done();
    },
    { once: true }
  );
};

export const createDeliveries = (items) => {
  return items.map((it) => ({
    id: it.id,
    name: it.name,
  }));
};
