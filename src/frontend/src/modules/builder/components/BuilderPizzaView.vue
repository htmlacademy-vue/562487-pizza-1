<template>
  <AppDrop @drop="moveIngredient">
    <div class="content__constructor">
      <div class="pizza" :class="pizzaFoundationClasses" data-test="pizza-view">
        <transition-group
          name="fillings"
          tag="div"
          class="pizza__wrapper"
          appear
        >
          <div
            v-for="{ ingredientId, quantity, value } in pizzaIngredients"
            :key="`${ingredientId}-${quantity}`"
            class="pizza__filling"
            :class="{
              [`pizza__filling--${value}`]: true,
              'pizza__filling--second': quantity === 2,
              'pizza__filling--third': quantity === 3,
            }"
            :data-quantity="quantity"
            data-test="filling-item"
          />
        </transition-group>
      </div>
    </div>
  </AppDrop>
</template>

<script>
import { mapState, mapGetters, mapMutations } from "vuex";
import { ADD_BUILDER_PIZZA_INGREDIENT } from "../../../store/mutations-types";

export default {
  name: "BuilderPizzaView",
  computed: {
    ...mapState("Builder", ["pizza"]),
    ...mapGetters("Builder", [
      "doughById",
      "sauceById",
      "ingredientById",
      "ingredientQuantityById",
    ]),

    pizzaIngredients() {
      return this.pizza.ingredients.map(({ ingredientId, quantity }) => {
        const ingredient = this.ingredientById(ingredientId);
        return {
          ...ingredient,
          quantity,
        };
      });
    },

    pizzaFoundationClasses() {
      const { doughId, sauceId } = this.pizza;
      const dough = this.doughById(doughId)?.foundation || "";
      const sauce = this.sauceById(sauceId)?.value || "";
      return `pizza--foundation--${dough}-${sauce}`;
    },
  },
  methods: {
    ...mapMutations("Builder", {
      addPizzaIngredient: ADD_BUILDER_PIZZA_INGREDIENT,
    }),

    moveIngredient(active) {
      const { ingredientId } = active;
      const quantity = this.ingredientQuantityById(ingredientId);
      this.addPizzaIngredient({
        ingredientId,
        quantity: quantity + 1,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@for $i from 1 through 3 {
  .fillings-enter-active[data-quantity="#{$i}"] {
    animation: bounce-in-#{$i} 0.5s;
  }
  .fillings-leave-active[data-quantity="#{$i}"] {
    animation: bounce-in-#{$i} 0.5s reverse;
  }
}

@keyframes bounce-in-1 {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes bounce-in-2 {
  0% {
    transform: rotate(45deg) scale(0);
  }
  50% {
    transform: rotate(45deg) scale(1.2);
  }
  100% {
    transform: rotate(45deg) scale(1);
  }
}

@keyframes bounce-in-3 {
  0% {
    transform: rotate(-45deg) scale(0);
  }
  50% {
    transform: rotate(-45deg) scale(1.2);
  }
  100% {
    transform: rotate(-45deg) scale(1);
  }
}
</style>
