<template>
  <div class="content__ingredients">
    <div class="sheet">
      <h2 class="title title--small sheet__title">Выберите ингредиенты</h2>

      <div class="sheet__content ingredients">
        <div class="ingredients__sauce">
          <p>Основной соус:</p>

          <AppLoader v-if="areSaucesLoading" />

          <template v-else>
            <RadioButton
              v-for="sauce in sauces"
              :key="sauce.id"
              :item="sauce"
              :isChecked="sauce.id === pizza.sauceId"
              class="radio ingredients__input"
              @change="setPizzaEntity({ entity: 'sauceId', value: $event })"
            >
              <span>{{ sauce.name }}</span>
            </RadioButton>
          </template>
        </div>

        <div class="ingredients__filling">
          <p>Начинка:</p>

          <AppLoader v-if="areIngredientsLoading" />

          <ul v-else class="ingredients__list">
            <BuilderIngredient
              v-for="ingredient in ingredients"
              :key="ingredient.id"
              :ingredient="ingredient"
            />
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import {
  SET_BUILDER_PIZZA_ENTITY,
  UPDATE_BUILDER_PIZZA_INGREDIENTS,
} from "@/store/mutations-types";
import BuilderIngredient from "./BuilderIngredient";

export default {
  name: "BuilderIngredientsSelector",
  components: { BuilderIngredient },
  computed: {
    ...mapState("Builder", ["sauces", "ingredients", "pizza"]),

    areSaucesLoading() {
      return !this.sauces.length;
    },

    areIngredientsLoading() {
      return !this.ingredients.length;
    },
  },
  methods: {
    ...mapMutations("Builder", {
      setPizzaEntity: SET_BUILDER_PIZZA_ENTITY,
      updatePizzaIngredients: UPDATE_BUILDER_PIZZA_INGREDIENTS,
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
