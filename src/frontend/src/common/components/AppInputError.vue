<template>
  <span class="input__error-text">
    <slot />
  </span>
</template>

<script>
export default {
  name: "AppInputError",
};
</script>

<style lang="scss" scoped>
.input__error-text {
  position: absolute;
  top: -18px;
  left: 0;
  z-index: 2;
  color: $red-600;
}
</style>
