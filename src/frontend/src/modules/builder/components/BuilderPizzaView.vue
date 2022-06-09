<template>
  <AppDrop @drop="moveIngredient">
    <div class="content__constructor">
      <div class="pizza" :class="pizzaFoundationClasses">
        <transition-group
          name="fillings"
          tag="div"
          class="pizza__wrapper"
          appear
        >
          <div
            v-for="{ ingredientId, quantity } in pizza.ingredients"
            :key="`${ingredientId}-${quantity}`"
            :class="calcIngredientClasses({ ingredientId, quantity })"
            :data-quantity="quantity"
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
      "isLoading",
      "doughById",
      "sauceById",
      "ingredientById",
      "ingredientQuantityById",
    ]),

    pizzaFoundationClasses() {
      if (this.isLoading) {
        return "";
      }
      const { doughId, sauceId } = this.pizza;
      const dough = this.doughById(doughId).foundation || "";
      const sauce = this.sauceById(sauceId).value || "";
      return `pizza--foundation--${dough}-${sauce}`;
    },
  },
  methods: {
    ...mapMutations("Builder", {
      addPizzaIngredient: ADD_BUILDER_PIZZA_INGREDIENT,
    }),

    calcIngredientClasses({ ingredientId, quantity }) {
      if (this.isLoading) {
        return "";
      }
      const { value } = this.ingredientById(ingredientId);
      const baseClass = "pizza__filling";
      const valueClass = baseClass + `--${value}`;
      if (quantity === 1) {
        return `${baseClass} ${valueClass}`;
      }
      const modifiers = {
        2: "second",
        3: "third",
      };
      const quantityClass = baseClass + `--${modifiers[quantity]}`;
      return `${baseClass} ${valueClass} ${quantityClass}`;
    },

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
