<template>
  <div class="content__pizza">
    <label class="input">
      <span class="visually-hidden">Название пиццы</span>
      <input
        type="text"
        name="pizza_name"
        placeholder="Введите название пиццы"
        :value="pizzaName"
        @input="$emit('nameChange', $event.target.value.trim())"
      />
    </label>

    <AppDrop @drop="moveIngredient">
      <div class="content__constructor">
        <div class="pizza" :class="pizzaFoundationClasses">
          <div v-if="totalPrice" class="pizza__wrapper">
            <div
              v-for="ingredient in checkedIngredients"
              :key="ingredient.value"
              class="pizza__filling"
              :class="getPizzaFillingClasses(ingredient)"
            ></div>
          </div>
        </div>
      </div>
    </AppDrop>

    <BuilderPriceCounter
      :totalPrice="totalPrice"
      :isDisabled="isSubmitDisabled"
      @submit="$emit('submit', $event)"
    />
  </div>
</template>

<script>
import PizzaSauces from "@/common/enums/sauces";
import PizzaFoundations from "@/common/enums/foundations";
import BuilderPriceCounter from "@/modules/builder/components/BuilderPriceCounter";

export default {
  name: "BuilderPizzaView",
  components: { BuilderPriceCounter },
  props: {
    pizzaName: {
      type: String,
      required: true,
    },
    checkedDough: {
      type: [Number, String],
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
    totalPrice: {
      type: Number,
      required: true,
    },
  },
  computed: {
    pizzaFoundationClasses() {
      const dough = PizzaFoundations[this.checkedDough];
      const sauce = PizzaSauces[this.checkedSauce];
      return `pizza--foundation--${dough}-${sauce}`;
    },
    isSubmitDisabled() {
      return (
        !this.pizzaName || !this.checkedIngredients.length || !this.totalPrice
      );
    },
  },
  methods: {
    getPizzaFillingClasses(ingredient) {
      const valueClass = `pizza__filling--${ingredient.value}`;
      const count = ingredient.count;
      if (count === 1) {
        return valueClass;
      }
      const CountModifiers = {
        2: "second",
        3: "third",
      };
      const countClass = `pizza__filling--${CountModifiers[count]}`;
      return `${valueClass} ${countClass}`;
    },
    moveIngredient(active) {
      this.$emit("incrementCount", active.id);
    },
  },
};
</script>

<style lang="scss" scoped></style>
