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
              v-for="{ ingredientId, quantity } in pizza.ingredients"
              :key="ingredientId"
            >
              <BuilderPizzaFillingItem :id="ingredientId" />
              <BuilderPizzaFillingItem
                v-if="quantity > 1"
                class="pizza__filling--second"
                :id="ingredientId"
              />
              <BuilderPizzaFillingItem
                v-if="quantity > 2"
                class="pizza__filling--third"
                :id="ingredientId"
              />
            </div>
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
  SET_PIZZA_ENTITY,
  UPDATE_PIZZA_INGREDIENTS,
} from "@/store/mutations-types";
import BuilderPizzaFillingItem from "./BuilderPizzaFillingItem.vue";

export default {
  components: { BuilderPizzaFillingItem },
  name: "BuilderPizzaView",
  computed: {
    ...mapState("Builder", ["pizza"]),
    ...mapGetters("Builder", ["doughById", "sauceById"]),

    pizzaFoundationClasses() {
      const { doughId, sauceId } = this.pizza;
      const dough = this.doughById(doughId).foundation;
      const sauce = this.sauceById(sauceId).value;
      return `pizza--foundation--${dough}-${sauce}`;
    },
  },
  methods: {
    ...mapMutations("Builder", {
      setPizzaEntity: SET_PIZZA_ENTITY,
      updatePizzaIngredients: UPDATE_PIZZA_INGREDIENTS,
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
