<template>
  <div class="counter">
    <button
      type="button"
      class="counter__button counter__button--minus"
      :disabled="quantity === min"
      @click="$emit('decrementClick', $event)"
      data-test="button-minus"
    >
      <span class="visually-hidden">Меньше</span>
    </button>
    <input
      type="text"
      name="counter"
      class="counter__input"
      :value="quantity"
      readonly
      data-test="counter-input"
    />
    <button
      type="button"
      class="counter__button counter__button--plus"
      :disabled="quantity === max"
      @click="$emit('incrementClick', $event)"
      data-test="button-plus"
    >
      <span class="visually-hidden">Больше</span>
    </button>
  </div>
</template>

<script>
export default {
  name: "ItemCounter",
  props: {
    quantity: {
      type: Number,
      required: true,
    },
    min: {
      type: Number,
      default: 0,
    },
    max: {
      type: Number,
      default: Infinity,
    },
  },
};
</script>
