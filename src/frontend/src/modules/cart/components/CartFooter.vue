<template>
  <section class="footer">
    <div class="footer__more">
      <router-link to="/" class="button button--border button--arrow"
        >Хочу еще одну</router-link
      >
    </div>
    <p class="footer__text">
      Перейти к конструктору<br />чтоб собрать ещё одну пиццу
    </p>
    <div class="footer__price">
      <b>Итого: {{ cartTotalSum }} ₽</b>
    </div>

    <div class="footer__submit">
      <button
        type="submit"
        class="button"
        :disabled="!cartTotalSum"
        @click.prevent="handleOrder"
      >
        Оформить заказ
      </button>
    </div>
    <slot />
  </section>
</template>

<script>
import { generateNewOrder } from "@/common/helpers";

export default {
  name: "CartFooter",
  props: {
    user: {
      type: Object,
      default: null,
    },
    cart: {
      type: Object,
      required: true,
    },
    cartTotalSum: {
      type: Number,
      required: true,
    },
  },
  methods: {
    handleOrder() {
      const newOrder = generateNewOrder({
        pizzas: this.cart.pizzas.slice(),
        addons: this.cart.addons.filter((addon) => addon.count > 0),
        total: this.cartTotalSum,
      });
      this.$emit("addNewOrder", newOrder);
      this.$emit("showPopup");
    },
  },
};
</script>
