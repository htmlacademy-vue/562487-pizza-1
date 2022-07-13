<template>
  <div class="counter">
    <button
      type="button"
      :disabled="quantity === min"
      class="counter__button counter__button--minus"
      data-test="button-minus"
      @click="$emit('decrement', $event)"
    >
      <span class="visually-hidden">Меньше</span>
    </button>
    <input
      type="text"
      name="counter"
      :value="quantity"
      readonly
      class="counter__input"
      data-test="counter-input"
    />
    <button
      type="button"
      :disabled="quantity === max"
      class="counter__button counter__button--plus"
      data-test="button-plus"
      @click="$emit('increment', $event)"
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
