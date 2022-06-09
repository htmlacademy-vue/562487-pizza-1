<template>
  <AppDrag :transfer-data="ingredient" :isDraggable="isDraggable">
    <span :class="isDraggable && 'item--draggable'">
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

    quantity() {
      const id = this.ingredient.ingredientId;
      return this.ingredientQuantityById(id);
    },

    isDraggable() {
      return this.quantity < INGREDIENT_MAX_COUNT;
    },
  },
};
</script>

<style lang="scss" scoped>
.item--draggable:hover {
  cursor: grab;
}
</style>
