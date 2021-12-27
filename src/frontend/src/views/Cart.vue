<template>
  <form action="#" method="post" class="layout-form">
    <main class="content cart">
      <div class="container">
        <div class="cart__title">
          <h1 class="title title--big">Корзина</h1>
        </div>

        <div v-if="isCartEmpty" class="sheet cart__empty">
          <p>В корзине нет ни одного товара</p>
        </div>

        <CartPizzas
          v-if="!isCartEmpty"
          :pizzas="cart.pizzas"
          @updatePizzas="$emit('updatePizzas', $event)"
        />

        <CartAddons
          v-if="!isCartEmpty"
          :addons="cart.addons"
          @updateAddons="$emit('updateAddons', $event)"
        />

        <CartDelivery v-if="!isCartEmpty" :addresses="addresses" />
      </div>
    </main>
    <CartFooter
      :cart="cart"
      :cartTotalSum="cartTotalSum"
      @addNewOrder="$emit('addNewOrder', $event)"
      @showPopup="isPopupShowed = true"
    />
    <CartPopup v-if="isPopupShowed" @closePopup="closePopup" />
  </form>
</template>

<script>
import {
  CartAddons,
  CartPizzas,
  CartDelivery,
  CartFooter,
  CartPopup,
} from "@/modules/cart/components";

export default {
  name: "Cart",
  components: { CartAddons, CartPizzas, CartDelivery, CartFooter, CartPopup },
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
    addresses: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      isPopupShowed: false,
    };
  },
  computed: {
    isCartEmpty() {
      return !this.cart.pizzas.length;
    },
  },
  methods: {
    closePopup() {
      if (!this.user) {
        this.$router.push({ name: "IndexHome" });
      } else {
        this.$router.push({ name: "Orders" });
      }
    },
  },
};
</script>
