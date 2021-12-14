<template>
  <AppDrag :transfer-data="ingredient" :isDraggable="isDraggable">
    <span :class="isDraggable && 'item--draggable'">
      {{ ingredient.name }}
    </span>
  </AppDrag>
</template>

<script>
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
    isDraggable() {
      return this.ingredient.count < INGREDIENT_MAX_COUNT;
    },
  },
};
</script>

<style lang="scss" scoped>
.item--draggable:hover {
  cursor: grab;
}
</style>
