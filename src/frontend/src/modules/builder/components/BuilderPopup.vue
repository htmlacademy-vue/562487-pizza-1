<template>
  <PopupLayout @close="$emit('close')">
    <div class="popup__title">
      <h2 class="title">Сохранить изменения?</h2>
      <p>Вы редактировали пиццу.</p>
    </div>
    <PopupButton
      ref="save"
      data-test="save-btn"
      @click.prevent="$emit('save')"
      >Сохранить</PopupButton
    >
    <PopupButton
      class="popup__button--danger"
      data-test="cancel-btn"
      @click.prevent="$emit('cancel')"
      >Продолжить без сохранения</PopupButton
    >
  </PopupLayout>
</template>

<script>
export default {
  name: "BuilderPopup",
  mounted() {
    this.$refs.save.focus();
  },
};
</script>
