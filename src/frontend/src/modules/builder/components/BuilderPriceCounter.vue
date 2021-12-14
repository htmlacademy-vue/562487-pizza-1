<template>
  <div class="content__result">
    <p>Итого: {{ totalPrice }} ₽</p>
    <button
      type="button"
      class="button"
      :disabled="isDisabled"
      @click.prevent="$emit('submit', $event)"
    >
      Готовьте!
    </button>
  </div>
</template>

<script>
export default {
  name: "BuilderPriceCounter",
  props: {
    totalPrice: {
      type: Number,
      required: true,
    },
    isDisabled: {
      type: Boolean,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped></style>
