<template>
  <div class="content__result">
    <p>Итого: {{ builderPizzaPrice }} ₽</p>
    <slot />
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "BuilderPriceCounter",
  computed: {
    ...mapGetters("Builder", ["builderPizzaPrice"]),
  },
};
</script>
