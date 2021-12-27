<template>
  <ul class="cart-list sheet">
    <li v-for="pizza in pizzas" :key="pizza.id" class="cart-list__item">
      <Product class="cart-list__product" :pizza="pizza" />

      <ItemCounter
        class="cart-list__counter"
        :count="pizza.count"
        :max="PIZZA_MAX_COUNT"
        @incrementClick="
          $emit('updatePizzas', { id: pizza.id, count: pizza.count + 1 })
        "
        @decrementClick="
          $emit('updatePizzas', { id: pizza.id, count: pizza.count - 1 })
        "
      />

      <div class="cart-list__price">
        <b>{{ pizza.price * pizza.count }} ₽</b>
      </div>

      <div class="cart-list__button">
        <button type="button" class="cart-list__edit">Изменить</button>
      </div>
    </li>
  </ul>
</template>

<script>
import pizza from "@/static/pizza.json";
import { PIZZA_MAX_COUNT } from "@/common/constants";
import ItemCounter from "@/common/components/ItemCounter";
import Product from "@/common/components/Product";

export default {
  name: "CartPizzas",
  components: {
    ItemCounter,
    Product,
  },
  props: {
    pizzas: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      PIZZA_MAX_COUNT,
    };
  },
  methods: {
    getSizeName(sizeId) {
      const size = pizza.sizes.find((it) => it.id === sizeId);
      return size.name;
    },
    getDoughName(doughId) {
      const dough = pizza.dough.find((it) => it.id === doughId);
      const doughName = dough.name.slice(0, -1) + "м";
      return doughName.toLowerCase();
    },
    getSauceName(sauceId) {
      const sauce = pizza.sauces.find((it) => it.id === sauceId);
      return sauce.name.toLowerCase();
    },
    getIngredientsNames(ingredients) {
      const names = ingredients.map((it) => it.name.toLowerCase());
      return names.join(", ");
    },
  },
};
</script>
