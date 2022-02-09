<template>
  <li class="ingredients__item">
    <SelectorItem
      :ingredient="pizzaIngredient"
      class="filling"
      :class="`filling--${pizzaIngredient.value}`"
    />
    <ItemCounter
      class="counter--orange ingredients__counter"
      :quantity="pizzaIngredient.quantity"
      :max="INGREDIENT_MAX_COUNT"
      @incrementClick="
        updatePizzaIngredients({
          ingredientId: pizzaIngredient.id,
          quantity: pizzaIngredient.quantity + 1,
        })
      "
      @decrementClick="
        updatePizzaIngredients({
          ingredientId: pizzaIngredient.id,
          quantity: pizzaIngredient.quantity - 1,
        })
      "
    />
  </li>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import { INGREDIENT_MAX_COUNT } from "@/common/constants";
import { UPDATE_BUILDER_PIZZA_INGREDIENTS } from "@/store/mutations-types";

export default {
  name: "BuilderIngredient",
  props: {
    ingredient: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      INGREDIENT_MAX_COUNT,
    };
  },
  computed: {
    ...mapGetters("Builder", ["pizzaIngredientById"]),

    pizzaIngredient() {
      const quantity =
        this.pizzaIngredientById(this.ingredient.id)?.quantity || 0;

      return {
        ...this.ingredient,
        quantity,
      };
    },
  },
  methods: {
    ...mapMutations("Builder", {
      updatePizzaIngredients: UPDATE_BUILDER_PIZZA_INGREDIENTS,
    }),
  },
};
</script>
