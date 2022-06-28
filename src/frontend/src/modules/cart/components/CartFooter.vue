<template>
  <section class="footer">
    <div class="footer__more">
      <router-link
        to="/"
        class="button button--border button--arrow"
        data-test="one-more-btn"
        >Хочу еще одну</router-link
      >
    </div>
    <p class="footer__text">
      Перейти к конструктору<br />чтоб собрать ещё одну пиццу
    </p>
    <div class="footer__price" data-test="footer-price">
      <b>Итого: {{ totalSum }} ₽</b>
    </div>

    <div class="footer__submit">
      <AppButton type="submit" :disabled="isSubmitDisabled">
        Оформить заказ
      </AppButton>
    </div>
    <slot />
  </section>
</template>

<script>
export default {
  name: "CartFooter",
  props: {
    isSubmitDisabled: {
      type: Boolean,
      required: true,
    },
    totalSum: {
      type: Number,
      required: true,
    },
  },
};
</script>
