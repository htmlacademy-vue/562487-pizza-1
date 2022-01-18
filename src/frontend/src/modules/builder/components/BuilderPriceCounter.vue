<template>
  <div class="content__result">
    <p>Итого: {{ totalPrice }} ₽</p>
    <slot />
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
  },
};
</script>
