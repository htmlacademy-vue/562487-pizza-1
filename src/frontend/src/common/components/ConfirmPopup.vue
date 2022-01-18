<template>
  <PopupLayout @close="$emit('cancel')">
    <div class="popup__title">
      <slot />
    </div>
    <PopupButton class="popup__button--danger" @click.prevent="$emit('confirm')"
      >Да, удалить!</PopupButton
    >
    <PopupButton @click.prevent="$emit('cancel')" ref="cancel"
      >Нет, оставить!</PopupButton
    >
  </PopupLayout>
</template>

<script>
import PopupLayout from "@/modules/popup/components/PopupLayout";
import PopupButton from "@/modules/popup/components/PopupButton";

export default {
  name: "ConfirmPopup",
  components: {
    PopupLayout,
    PopupButton,
  },
  mounted() {
    this.$refs.cancel.focus();
  },
};
</script>
