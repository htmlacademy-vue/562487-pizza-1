<template>
  <li class="order__item">
    <Product :pizza="pizza" />

    <p class="order__price" data-test="pizza-price">
      {{ pizza.quantity }} х {{ pizzaPrice(pizza) }} ₽
    </p>
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
  },
};
</script>
