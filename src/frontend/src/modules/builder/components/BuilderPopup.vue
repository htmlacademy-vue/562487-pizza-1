<template>
  <PopupLayout @close="$emit('close')">
    <div class="popup__title">
      <h2 class="title">Сохранить изменения?</h2>
      <p>Вы редактировали пиццу.</p>
    </div>
    <PopupButton @click.prevent="$emit('save')" ref="save" data-test="save-btn"
      >Сохранить</PopupButton
    >
    <PopupButton
      class="popup__button--danger"
      @click.prevent="$emit('cancel')"
      data-test="cancel-btn"
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
