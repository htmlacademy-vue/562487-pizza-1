<template>
  <PopupLayout close="closePopup">
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
import PopupLayout from "@/modules/popup/components/PopupLayout";
import PopupButton from "@/modules/popup/components/PopupButton";

export default {
  name: "CartPopup",
  components: {
    PopupLayout,
    PopupButton,
  },
  mounted() {
    this.$refs.ok.focus();
  },
};
</script>
