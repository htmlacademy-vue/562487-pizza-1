<template>
  <div class="content__result">
    <p>Итого: {{ pizzaPrice(pizza) }} ₽</p>
    <AppButton type="submit" :disabled="isSubmitDisabled">Готовьте!</AppButton>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";

export default {
  name: "BuilderPizzaResult",
  computed: {
    ...mapState("Builder", ["pizza"]),
    ...mapGetters("Builder", ["pizzaPrice"]),

    isSubmitDisabled() {
      return !this.pizza.name || !this.pizza.ingredients.length;
    },
  },
};
</script>
