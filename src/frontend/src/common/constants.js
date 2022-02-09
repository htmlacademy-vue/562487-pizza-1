export const INGREDIENT_MAX_COUNT = 3;
export const MOVE = "move";
export const DATA_TRANSFER_PAYLOAD = "payload";
export const SEC = 1000;
export const MESSAGE_LIVE_TIME = 3 * SEC;

/* eslint-disable */
export const emailRegex =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const urlRegex =
  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/;
/* eslint-enable */

export const BASE_DELIVERIES = [
  {
    id: "delivery_1",
    name: "Заберу сам",
  },
  {
    id: "delivery_2",
    name: "Новый адрес",
  },
];
