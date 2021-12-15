<template>
  <div class="content__ingredients">
    <div class="sheet">
      <h2 class="title title--small sheet__title">Выберите ингредиенты</h2>

      <div class="sheet__content ingredients">
        <div class="ingredients__sauce">
          <p>Основной соус:</p>

          <RadioButton
            v-for="sauce in sauces"
            :key="sauce.id"
            :item="sauce"
            :checkedItem="checkedSauce"
            class="radio ingredients__input"
            @change="$emit('sauceChange', $event)"
          >
            <span>{{ sauce.name }}</span>
          </RadioButton>
        </div>

        <div class="ingredients__filling">
          <p>Начинка:</p>

          <ul class="ingredients__list">
            <li
              v-for="ingredient in ingredients"
              :key="ingredient.id"
              class="ingredients__item"
            >
              <SelectorItem
                :ingredient="ingredient"
                class="filling"
                :class="`filling--${ingredient.value}`"
              />
              <ItemCounter
                :count="ingredient.count"
                :min="INGREDIENT_MIN_COUNT"
                :max="INGREDIENT_MAX_COUNT"
                @incrementClick="$emit('ingredientIncrement', ingredient.id)"
                @decrementClick="$emit('ingredientDecrement', ingredient.id)"
              />
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { INGREDIENT_MIN_COUNT, INGREDIENT_MAX_COUNT } from "@/common/constants";

export default {
  name: "BuilderIngredientsSelector",
  props: {
    sauces: {
      type: Array,
      required: true,
    },
    ingredients: {
      type: Array,
      required: true,
    },
    checkedSauce: {
      type: [Number, String],
      required: true,
    },
    checkedIngredients: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      INGREDIENT_MIN_COUNT,
      INGREDIENT_MAX_COUNT,
    };
  },
};
</script>

<style lang="scss" scoped></style>
