<template>
  <div class="popup__button">
    <a href="#" class="button" v-on="$listeners" ref="button">
      <slot />
    </a>
  </div>
</template>

<script>
export default {
  name: "PopupButton",
  methods: {
    focus() {
      this.$refs.button.focus();
    },
  },
};
</script>

<style lang="scss" scoped>
.popup__button a:focus {
  opacity: 1;
  outline: 2px solid $blue-500;
}
</style>
