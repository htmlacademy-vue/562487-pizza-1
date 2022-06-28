import {
  Dough,
  Sauce,
  Size,
  Ingredient,
  Misc,
  Pizza,
  User,
  Address,
  Order,
  OrderMisc,
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
export const testOrder = new Order({
  id: 1,
  userId: testUser.id,
  phone: "88008008000",
  orderPizzas: [
    {
      id: 1,
      name: "Pizzka",
      sauceId: 1,
      doughId: 1,
      sizeId: 1,
      quantity: 1,
      orderId: 1,
      ingredients: [
        {
          id: 1,
          pizzaId: 1,
          ingredientId: 1,
          quantity: 1,
        },
      ],
    },
  ],
  orderMisc: [
    {
      id: 1,
      orderId: 1,
      miscId: 1,
      quantity: 1,
    },
  ],
  orderAddress: testAddress,
});
export const testCartPizza = new Pizza({
  id: 1,
  name: "Cart Pizka",
  doughId: 1,
  sauceId: 1,
  sizeId: 2,
  ingredients: [
    {
      ingredientId: 1,
      quantity: 1,
    },
  ],
  quantity: 1,
});

export const testCartMisc = new OrderMisc({
  miscId: 1,
  quantity: 1,
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

export const setOrders = (store) => {
  store.commit("SET_ENTITY", {
    module: "Orders",
    entity: "orders",
    value: [testOrder],
  });
};

export const setLoadData = (store) => {
  setDoughs(store);
  setSauces(store);
  setSizes(store);
  setIngredients(store);
  setMisc(store);
};

export const setCart = (store) => {
  setCartPizzas(store, [testCartPizza]);
  setOrderMisc(store, [testCartMisc]);
};
