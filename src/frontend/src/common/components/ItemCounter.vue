<template>
  <div class="counter">
    <button
      type="button"
      class="counter__button counter__button--minus"
      :disabled="count === min"
      @click="$emit('decrementClick', $event)"
    >
      <span class="visually-hidden">Меньше</span>
    </button>
    <input
      type="text"
      name="counter"
      class="counter__input"
      :value="count"
      readonly
    />
    <button
      type="button"
      class="counter__button counter__button--plus"
      :disabled="count === max"
      @click="$emit('incrementClick', $event)"
    >
      <span class="visually-hidden">Больше</span>
    </button>
  </div>
</template>

<script>
import { MIN_COUNT } from "@/common/constants";

export default {
  name: "ItemCounter",
  props: {
    count: {
      type: Number,
      required: true,
    },
    min: {
      type: Number,
      default: MIN_COUNT,
    },
    max: {
      type: Number,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped></style>
