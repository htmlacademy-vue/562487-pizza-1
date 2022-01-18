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
            :isChecked="sauce.id === pizza.sauceId"
            class="radio ingredients__input"
            @change="setPizzaEntity({ name: 'sauceId', value: $event })"
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
                :quantity="getIngredientQuantity(ingredient.id)"
                class="filling"
                :class="`filling--${ingredient.value}`"
              />
              <ItemCounter
                class="counter--orange ingredients__counter"
                :quantity="getIngredientQuantity(ingredient.id)"
                :max="INGREDIENT_MAX_COUNT"
                @incrementClick="
                  updatePizzaIngredients({
                    ingredientId: ingredient.id,
                    quantity: getIngredientQuantity(ingredient.id) + 1,
                  })
                "
                @decrementClick="
                  updatePizzaIngredients({
                    ingredientId: ingredient.id,
                    quantity: getIngredientQuantity(ingredient.id) - 1,
                  })
                "
              />
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { INGREDIENT_MAX_COUNT } from "@/common/constants";
import {
  SET_PIZZA_ENTITY,
  UPDATE_PIZZA_INGREDIENTS,
} from "@/store/mutations-types";

export default {
  name: "BuilderIngredientsSelector",
  data() {
    return {
      INGREDIENT_MAX_COUNT,
    };
  },
  computed: {
    ...mapState("Builder", ["sauces", "ingredients", "pizza"]),
  },
  methods: {
    ...mapMutations("Builder", {
      setPizzaEntity: SET_PIZZA_ENTITY,
      updatePizzaIngredients: UPDATE_PIZZA_INGREDIENTS,
    }),
    getIngredientQuantity(id) {
      const pizzaIngredient = this.pizza.ingredients.find(
        (it) => it.ingredientId === id
      );
      return pizzaIngredient?.quantity || 0;
    },
  },
};
</script>
