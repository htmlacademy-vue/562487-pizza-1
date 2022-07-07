<template>
  <PopupLayout @close="$emit('cancel')">
    <div class="popup__title">
      <slot />
    </div>
    <PopupButton
      class="popup__button--danger"
      @click.prevent="confirm"
      data-test="confirm-btn"
      >Да, удалить!</PopupButton
    >
    <PopupButton
      @click.prevent="$emit('cancel')"
      ref="cancel"
      data-test="cancel-btn"
      >Нет, оставить!</PopupButton
    >
  </PopupLayout>
</template>

<script>
export default {
  name: "ConfirmPopup",
  props: {
    isSubmitting: {
      type: Boolean,
      default: false,
    },
  },
  mounted() {
    this.$refs.cancel.focus();
  },
  methods: {
    confirm() {
      if (this.isSubmitting) {
        return;
      }
      this.$emit("confirm");
    },
  },
};
</script>
