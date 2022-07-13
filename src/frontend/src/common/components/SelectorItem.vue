<template>
  <AppDrag
    :transfer-data="ingredient"
    :is-draggable="isDraggable"
  >
    <span
      :class="isDraggable && 'item--draggable'"
      data-test="selector-item"
    >
      {{ ingredient.name }}
    </span>
  </AppDrag>
</template>

<script>
import { mapGetters } from "vuex";
import AppDrag from "@/common/components/AppDrag";
import { INGREDIENT_MAX_COUNT } from "@/common/constants";

export default {
  name: "SelectorItem",
  components: {
    AppDrag,
  },

  props: {
    ingredient: {
      type: Object,
      required: true,
    },
  },

  computed: {
    ...mapGetters("Builder", ["ingredientQuantityById"]),

    isDraggable() {
      const id = this.ingredient.ingredientId;
      const quantity = this.ingredientQuantityById(id);
      return quantity < INGREDIENT_MAX_COUNT;
    },
  },
};
</script>

<style lang="scss" scoped>
.item--draggable:hover {
  cursor: grab;
}
</style>
