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
                :ingredient="ingredient"
                @incrementClick="$emit('incrementClick', $event)"
                @decrementClick="$emit('decrementClick', $event)"
              />
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RadioButton from "@/common/components/RadioButton";
import ItemCounter from "@/common/components/ItemCounter";
import SelectorItem from "@/common/components/SelectorItem";

export default {
  name: "BuilderIngredientsSelector",
  components: { RadioButton, ItemCounter, SelectorItem },
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
};
</script>

<style lang="scss" scoped></style>
