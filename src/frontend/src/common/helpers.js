import { uniqueId } from "lodash";

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

export const generateNewPizza = (pizza) => ({
  id: uniqueId("pizza_"),
  ...pizza,
});

export const generateNewOrder = (order) => ({
  id: uniqueId("order_"),
  number: 123456,
  ...order,
});

export const calculateSum = (items) => {
  if (!items.length) {
    return 0;
  }
  return items
    .map((it) => it.price * it.count)
    .reduce((acc, it) => acc + it, 0);
};
