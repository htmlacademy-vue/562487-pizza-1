<template>
  <PopupLayout @close="$emit('cancel')">
    <div class="popup__title">
      <slot />
    </div>
    <PopupButton
      class="popup__button--danger"
      data-test="confirm-btn"
      @click.prevent="confirm"
      >Да, удалить!</PopupButton
    >
    <PopupButton
      ref="cancel"
      data-test="cancel-btn"
      @click.prevent="$emit('cancel')"
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
