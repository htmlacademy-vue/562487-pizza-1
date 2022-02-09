<template>
  <div class="pizza__filling" :class="pizzaFillingClasses" />
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "BuilderPizzaFillingItem",
  props: {
    id: {
      type: [Number, String],
      required: true,
    },
  },
  computed: {
    ...mapGetters("Builder", ["ingredientById"]),

    pizzaFillingClasses() {
      return `pizza__filling--${this.ingredientById(this.id).value}`;
    },
  },
};
</script>
