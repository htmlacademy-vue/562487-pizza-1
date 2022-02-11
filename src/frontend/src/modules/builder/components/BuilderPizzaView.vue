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
            entity: 'name',
            value: $event.target.value.trim(),
          })
        "
      />
    </label>

    <AppLoader v-if="isLoading" />
    <AppDrop v-else @drop="moveIngredient">
      <div class="content__constructor">
        <div class="pizza" :class="pizzaFoundationClasses">
          <div class="pizza__wrapper">
            <transition-group name="ingredients">
              <div
                v-for="{ ingredientId, quantity } in pizza.ingredients"
                :key="ingredientId"
                class="ingredients"
              >
                <BuilderPizzaFillingItem :id="ingredientId" />
                <transition name="ingredient-second">
                  <BuilderPizzaFillingItem
                    v-if="quantity > 1"
                    class="pizza__filling--second ingredient-second"
                    :id="ingredientId"
                  />
                </transition>
                <transition name="ingredient-third">
                  <BuilderPizzaFillingItem
                    v-if="quantity > 2"
                    class="pizza__filling--third ingredient-third"
                    :id="ingredientId"
                  />
                </transition>
              </div>
            </transition-group>
          </div>
        </div>
      </div>
    </AppDrop>

    <slot />
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from "vuex";
import {
  SET_BUILDER_PIZZA_ENTITY,
  UPDATE_BUILDER_PIZZA_INGREDIENTS,
} from "@/store/mutations-types";
import BuilderPizzaFillingItem from "./BuilderPizzaFillingItem.vue";

export default {
  components: { BuilderPizzaFillingItem },
  name: "BuilderPizzaView",
  computed: {
    ...mapState("Builder", ["pizza"]),
    ...mapGetters("Builder", ["doughById", "sauceById", "isLoading"]),

    pizzaFoundationClasses() {
      const { doughId, sauceId } = this.pizza;
      const dough = this.doughById(doughId).foundation;
      const sauce = this.sauceById(sauceId).value;
      return `pizza--foundation--${dough}-${sauce}`;
    },
  },
  methods: {
    ...mapMutations("Builder", {
      setPizzaEntity: SET_BUILDER_PIZZA_ENTITY,
      updatePizzaIngredients: UPDATE_BUILDER_PIZZA_INGREDIENTS,
    }),

    moveIngredient(active) {
      this.updatePizzaIngredients({
        ingredientId: active.id,
        quantity: active.quantity + 1,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.ingredient-second,
.ingredient-third,
.ingredients {
  transition: all 0.5s;
}

.ingredient-second-enter,
.ingredient-second-leave-to {
  transform: rotate(45deg) scale(0);
}

.ingredient-second-enter-to {
  transform: rotate(45deg) scale(1);
}

.ingredient-third-enter,
.ingredient-third-leave-to {
  transform: rotate(-45deg) scale(0);
}

.ingredient-third-enter-to {
  transform: rotate(-45deg) scale(1);
}

.ingredients-enter,
.ingredients-leave-to {
  opacity: 0;
}

.ingredients-enter-to {
  opacity: 1;
}
</style>
