<template>
  <div class="popup">
    <a href="#" class="close" @click.prevent="$emit('closePopup')">
      <span class="visually-hidden">Закрыть попап</span>
    </a>
    <div class="popup__title">
      <h2 class="title">Спасибо за заказ</h2>
    </div>
    <p>Мы начали готовить Ваш заказ, скоро привезём его вам ;)</p>
    <div class="popup__button">
      <a href="#" class="button" @click.prevent="$emit('closePopup')"
        >Отлично, я жду!</a
      >
    </div>
  </div>
</template>

<script>
export default {
  name: "CartPopup",
};
</script>
