import {
  Dough,
  Sauce,
  Size,
  Ingredient,
  Misc,
  Pizza,
  User,
  Address,
} from "@/common/models";
import pizzaData from "@/static/pizza.json";
import miscData from "@/static/misc.json";
import userData from "@/static/user.json";

export const testDoughs = Dough.parseItems(pizzaData.dough);
export const testSauces = Sauce.parseItems(pizzaData.sauces);
export const testSizes = Size.parseItems(pizzaData.sizes);
export const testIngredients = Ingredient.parseItems(pizzaData.ingredients);
export const testMisc = Misc.parseItems(miscData);
export const testPizza = new Pizza({
  name: "Pizka",
  doughId: 1,
  sauceId: 1,
  sizeId: 2,
  ingredients: [],
  quantity: 1,
});
export const testUser = new User(userData);
export const testAddress = new Address({
  id: 1,
  street: "Baker street",
  building: "100",
  flat: "100",
  name: "ул.Baker street, д.1, кв.1",
  comment: "some comment",
  userId: testUser.id,
});

export const setDoughs = (store) => {
  store.commit("Builder/SET_BUILDER_ENTITY", {
    entity: "doughs",
    value: testDoughs,
  });
};

export const setSauces = (store) => {
  store.commit("Builder/SET_BUILDER_ENTITY", {
    entity: "sauces",
    value: testSauces,
  });
};

export const setSizes = (store) => {
  store.commit("Builder/SET_BUILDER_ENTITY", {
    entity: "sizes",
    value: testSizes,
  });
};

export const setIngredients = (store) => {
  store.commit("Builder/SET_BUILDER_ENTITY", {
    entity: "ingredients",
    value: testIngredients,
  });
};

export const addIngredient = (store, ingredient) => {
  store.commit("Builder/ADD_BUILDER_PIZZA_INGREDIENT", ingredient);
};

export const setPizzaName = (store, name) => {
  store.commit("Builder/SET_BUILDER_PIZZA_ENTITY", {
    entity: "name",
    value: name,
  });
};

export const setPizza = (store) => {
  store.commit("Builder/SET_BUILDER_ENTITY", {
    entity: "pizza",
    value: testPizza,
  });
};

export const setCartPizzas = (store, pizzas) => {
  store.commit("Cart/SET_CART_ENTITY", {
    entity: "orderPizzas",
    value: pizzas,
  });
};

export const setMisc = (store) => {
  store.commit("Cart/SET_CART_ENTITY", {
    entity: "misc",
    value: testMisc,
  });
};

export const setOrderMisc = (store, items) => {
  store.commit("Cart/SET_CART_ENTITY", {
    entity: "orderMisc",
    value: items,
  });
};

export const setCartAddress = (store, address) => {
  store.commit("Cart/SET_CART_ENTITY", {
    entity: "orderAddress",
    value: address,
  });
};

export const setDelivery = (store, delivery) => {
  store.commit("Cart/SET_CART_ENTITY", {
    entity: "delivery",
    value: delivery,
  });
};

export const setUser = (store) => {
  store.commit("SET_ENTITY", {
    module: "Auth",
    entity: "user",
    value: testUser,
  });
};

export const setUserAddresses = (store) => {
  store.commit("SET_ENTITY", {
    module: "Auth",
    entity: "addresses",
    value: [testAddress],
  });
};
