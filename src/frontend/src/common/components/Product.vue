<template>
  <div class="product">
    <img
      src="@/assets/img/product.svg"
      class="product__img"
      width="56"
      height="56"
      alt="pizza.name"
    />
    <div class="product__text">
      <h2>{{ pizza.name }}</h2>
      <ul>
        <li>
          {{ getSizeName(pizza.size) }}, на
          {{ getDoughName(pizza.dough) }} тесте
        </li>
        <li>Соус: {{ getSauceName(pizza.sauce) }}</li>
        <li>Начинка: {{ getIngredientsNames(pizza.ingredients) }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import pizza from "@/static/pizza.json";

export default {
  name: "Product",
  props: {
    pizza: {
      type: Object,
      required: true,
    },
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
