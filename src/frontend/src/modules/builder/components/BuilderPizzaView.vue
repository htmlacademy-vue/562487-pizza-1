<template>
  <div class="content__pizza">
    <label class="input">
      <span class="visually-hidden">Название пиццы</span>
      <input
        type="text"
        name="pizza_name"
        placeholder="Введите название пиццы"
        :value="pizza.name"
        @input="
          setPizzaEntity({
            name: 'name',
            value: $event.target.value.trim(),
          })
        "
      />
    </label>

    <AppDrop @drop="moveIngredient">
      <div class="content__constructor">
        <div class="pizza" :class="pizzaFoundationClasses">
          <div class="pizza__wrapper">
            <div
              v-for="ingredient in pizza.ingredients"
              :key="ingredient.value"
              class="pizza__filling"
              :class="getPizzaIngredientsClasses(ingredient)"
            ></div>
          </div>
        </div>
      </div>
    </AppDrop>

    <slot />
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from "vuex";
import PizzaSauces from "@/common/enums/sauces";
import PizzaFoundations from "@/common/enums/foundations";
import {
  SET_PIZZA_ENTITY,
  UPDATE_PIZZA_INGREDIENTS,
} from "@/store/mutations-types";

export default {
  name: "BuilderPizzaView",
  computed: {
    ...mapState("Builder", ["pizza"]),
    ...mapGetters("Builder", ["ingredientById"]),

    pizzaFoundationClasses() {
      const { doughId, sauceId } = this.pizza;
      const dough = PizzaFoundations[doughId];
      const sauce = PizzaSauces[sauceId];
      return `pizza--foundation--${dough}-${sauce}`;
    },
  },
  methods: {
    ...mapMutations("Builder", {
      setPizzaEntity: SET_PIZZA_ENTITY,
      updatePizzaIngredients: UPDATE_PIZZA_INGREDIENTS,
    }),

    getPizzaIngredientsClasses({ ingredientId, quantity }) {
      const ingredient = this.ingredientById(ingredientId);
      const valueClass = `pizza__filling--${ingredient.value}`;
      if (quantity === 1) {
        return valueClass;
      }
      const QuantityModifiers = {
        2: "second",
        3: "third",
      };
      const quantityClass = `pizza__filling--${QuantityModifiers[quantity]}`;
      return `${valueClass} ${quantityClass}`;
    },
    moveIngredient(active) {
      this.updatePizzaIngredients({
        ingredientId: active.id,
        quantity: active.quantity + 1,
      });
    },
  },
};
</script>
