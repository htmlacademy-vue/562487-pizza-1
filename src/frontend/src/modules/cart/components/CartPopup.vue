<template>
  <PopupLayout @close="$emit('close')">
    <div class="popup__title">
      <h2 class="title">Спасибо за заказ</h2>
    </div>
    <p>Мы начали готовить Ваш заказ, скоро привезём его вам ;)</p>
    <PopupButton @click.prevent="$emit('close')" ref="ok"
      >Отлично, я жду!</PopupButton
    >
  </PopupLayout>
</template>

<script>
export default {
  name: "CartPopup",
  mounted() {
    this.$refs.ok.focus();
  },
};
</script>
