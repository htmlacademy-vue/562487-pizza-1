<template>
  <li class="ingredients__item">
    <SelectorItem
      :ingredient="ingredient"
      class="filling"
      :class="`filling--${ingredient.value}`"
    />
    <ItemCounter
      class="counter--orange ingredients__counter"
      :quantity="quantity"
      :max="INGREDIENT_MAX_COUNT"
      @incrementClick="
        addPizzaIngredient({
          ingredientId: ingredient.ingredientId,
          quantity: quantity + 1,
        })
      "
      @decrementClick="removePizzaIngredient(ingredient)"
      data-test="item-counter"
    />
  </li>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import { INGREDIENT_MAX_COUNT } from "@/common/constants";
import {
  ADD_BUILDER_PIZZA_INGREDIENT,
  REMOVE_BUILDER_PIZZA_INGREDIENT,
} from "@/store/mutations-types";

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
    ...mapGetters("Builder", ["ingredientQuantityById"]),

    quantity() {
      return this.ingredientQuantityById(this.ingredient.ingredientId);
    },
  },
  methods: {
    ...mapMutations("Builder", {
      addPizzaIngredient: ADD_BUILDER_PIZZA_INGREDIENT,
      removePizzaIngredient: REMOVE_BUILDER_PIZZA_INGREDIENT,
    }),
  },
};
</script>
