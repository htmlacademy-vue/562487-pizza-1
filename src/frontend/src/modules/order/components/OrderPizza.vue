<template>
  <li class="order__item">
    <Product :pizza="pizza" />

    <p class="order__price" data-test="pizza-price">{{ priceText }}</p>
  </li>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "OrderPizza",
  props: {
    pizza: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapGetters("Builder", ["pizzaPrice"]),

    priceText() {
      const { quantity } = this.pizza;
      const price = this.pizzaPrice(this.pizza);
      return quantity > 1 ? `${quantity} х ${price} ₽` : `${price} ₽`;
    },
  },
};
</script>

<style lang="scss" scoped>
.order__price {
  margin-left: 10px;
}
</style>
