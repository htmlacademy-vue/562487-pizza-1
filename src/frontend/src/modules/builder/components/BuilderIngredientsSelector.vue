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
            :is-checked="sauce.id === pizza.sauceId"
            class="radio ingredients__input"
            data-test="sauce"
            @change="setPizzaEntity({ entity: 'sauceId', value: $event })"
          >
            <span>{{ sauce.name }}</span>
          </RadioButton>
        </div>

        <div class="ingredients__filling">
          <p>Начинка:</p>

          <ul class="ingredients__list">
            <BuilderIngredient
              v-for="ingredient in ingredients"
              :key="ingredient.ingredientId"
              :ingredient="ingredient"
              data-test="ingredient"
            />
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { SET_BUILDER_PIZZA_ENTITY } from "@/store/mutations-types";
import BuilderIngredient from "./BuilderIngredient";

export default {
  name: "BuilderIngredientsSelector",
  components: { BuilderIngredient },
  computed: {
    ...mapState("Builder", ["sauces", "ingredients", "pizza"]),
  },

  methods: {
    ...mapMutations("Builder", {
      setPizzaEntity: SET_BUILDER_PIZZA_ENTITY,
    }),
  },
};
</script>
