<template>
  <PopupLayout @close="$emit('close')" ref="close">
    <div class="popup__title">
      <h2 class="title">Вы хотите перейти без сохранения?</h2>
      <p>
        Чтобы сохранить изменения, закройте попап и нажмите на кнопку
        "Готовьте!"
      </p>
    </div>
    <PopupButton
      class="popup__button--danger"
      @click.prevent="$emit('cancel')"
      ref="cancel"
      >Не сохранять изменения</PopupButton
    >
  </PopupLayout>
</template>

<script>
import PopupLayout from "@/modules/popup/components/PopupLayout";
import PopupButton from "@/modules/popup/components/PopupButton";

export default {
  name: "BuilderPopup",
  components: {
    PopupLayout,
    PopupButton,
  },
  mounted() {
    this.$refs.close.focus();
  },
};
</script>
