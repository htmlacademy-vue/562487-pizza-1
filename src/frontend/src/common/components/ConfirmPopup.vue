<template>
  <PopupLayout @close="$emit('cancel')">
    <div class="popup__title">
      <slot />
    </div>
    <PopupButton
      class="popup__button--danger"
      :disabled="isSubmitting"
      @click.prevent="$emit('confirm')"
      >Да, удалить!</PopupButton
    >
    <PopupButton @click.prevent="$emit('cancel')" ref="cancel"
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
};
</script>
