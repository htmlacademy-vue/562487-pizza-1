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
.popup__button .button:focus {
  outline: 2px solid $blue-500;
}
.popup__button--danger .button {
  background-color: $red-500;
}
.popup__button--danger .button:hover:not(:active):not(:disabled) {
  background-color: $red-400;
}
.popup__button--danger .button:focus:not(:disabled) {
  opacity: 0.8;
}
.popup__button--danger .button:active:not(:disabled) {
  background-color: $red-800;
}
</style>
