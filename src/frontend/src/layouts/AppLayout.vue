<template>
  <div class="app-layout">
    <AppLayoutHeader :totalSum="cart.totalSum" />
    <main class="content">
      <IndexHome @updateCart="addPizzaToCart" />
    </main>
  </div>
</template>

<script>
import AppLayoutHeader from "@/layouts/AppLayoutHeader";
import IndexHome from "@/views/Index";

export default {
  name: "AppLayout",
  components: {
    AppLayoutHeader,
    IndexHome,
  },
  data() {
    return {
      cart: {
        pizzas: [],
        addons: [],
        delivery: "",
        phone: "",
        address: {
          street: "",
          house: "",
          flat: "",
        },
        totalSum: 0,
      },
    };
  },
  methods: {
    addPizzaToCart({ pizza, price }) {
      this.cart.pizzas.push(pizza);
      this.cart.totalSum += price;
    },
  },
};
</script>

<style lang="scss" scoped></style>
