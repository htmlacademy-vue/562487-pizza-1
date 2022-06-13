<template>
  <div class="product">
    <img
      src="@/assets/img/product.svg"
      class="product__img"
      width="56"
      height="56"
      :alt="pizza.name"
    />
    <div class="product__text" data-test="product-text">
      <h2 data-test="product-text-title">{{ pizza.name }}</h2>
      <ul data-test="product-text-list">
        <li>{{ sizeDisplayName }}, на {{ doughDisplayName }} тесте</li>
        <li>Соус: {{ sauceDisplayName }}</li>
        <li>Начинка: {{ ingredientsDisplayName }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Product",
  props: {
    pizza: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapGetters("Builder", [
      "doughById",
      "sauceById",
      "sizeById",
      "ingredientById",
    ]),

    doughDisplayName() {
      return this.doughById(this.pizza.doughId).displayName;
    },
    sauceDisplayName() {
      return this.sauceById(this.pizza.sauceId).displayName;
    },
    sizeDisplayName() {
      return this.sizeById(this.pizza.sizeId).displayName;
    },
    ingredientsDisplayName() {
      const displayNames = this.pizza.ingredients.map((it) => {
        const ingredient = this.ingredientById(it.ingredientId);
        return ingredient.displayName;
      });
      return Array.from(new Set(displayNames)).join(", ");
    },
  },
};
</script>
