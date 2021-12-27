<template>
  <div id="app">
    <AppLayout :user="user" :cartTotalSum="cartTotalSum" @logout="logout">
      <router-view
        :user="user"
        :cart="cart"
        :cartTotalSum="cartTotalSum"
        :orders="orders"
        :addresses="addresses"
        @login="login"
        @addNewPizza="addNewPizza"
        @updatePizzas="updatePizzas"
        @updateAddons="updateAddons"
        @addNewOrder="addNewOrder"
        @removeOrder="removeOrder"
      />
    </AppLayout>
  </div>
</template>

<script>
import user from "@/static/user.json";
import addons from "@/static/misc.json";
import { normalizeAddons } from "@/common/normalize";
import { findIndexById, calculateSum } from "@/common/helpers";

const mockAddress = {
  id: 1,
  name: "Дом",
  street: "Невский пр.",
  house: "22",
  apartment: "46",
  comment: "Позвоните, пожалуйста, от проходной",
};

export default {
  name: "App",
  data() {
    return {
      user: null,
      cart: {
        pizzas: [],
        addons: normalizeAddons(addons),
      },
      orders: [],
      addresses: [mockAddress],
    };
  },
  computed: {
    cartPizzasPrice() {
      return calculateSum(this.cart.pizzas);
    },
    cartAddonsPrice() {
      return calculateSum(this.cart.addons);
    },
    cartTotalSum() {
      return this.cartPizzasPrice + this.cartAddonsPrice;
    },
  },
  methods: {
    login() {
      this.user = user;
      this.$router.push({ name: "IndexHome" });
    },
    logout() {
      this.user = null;
      this.$router.push({ name: "Login" });
    },
    addNewPizza(pizza) {
      this.cart.pizzas.push(pizza);
    },
    updatePizzas({ id, count }) {
      const index = findIndexById(this.cart.pizzas, id);
      const pizzasCount = this.cart.pizzas.length;
      if (~index) {
        if (count > 0) {
          this.cart.pizzas[index].count = count;
        } else {
          if (pizzasCount === 1) {
            this.cart.addons = normalizeAddons(addons);
          }
          this.cart.pizzas.splice(index, 1);
        }
      }
    },
    updateAddons({ id, count }) {
      const index = findIndexById(this.cart.addons, id);
      if (~index) {
        this.cart.addons[index].count = count;
      }
    },
    resetCart() {
      this.cart.pizzas = [];
      this.cart.addons = normalizeAddons(addons);
    },
    addNewOrder(newOrder) {
      this.orders.push(newOrder);
      this.resetCart();
    },
    removeOrder(id) {
      const index = findIndexById(this.orders, id);
      if (~index) {
        this.orders.splice(index, 1);
      }
    },
  },
};
</script>

<style lang="scss">
@import "~@/assets/scss/app";
</style>
