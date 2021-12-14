import { uniqueId } from "lodash";

export const generateAvatar = (avatarUrl) => ({
  webp: avatarUrl.replace(/.jpg/gi, ".webp"),
  webp2x: avatarUrl.replace(/.jpg/gi, "@2x.webp"),
  jpg: avatarUrl,
  jpg2x: avatarUrl.replace(/.jpg/gi, "@2x.jpg"),
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
