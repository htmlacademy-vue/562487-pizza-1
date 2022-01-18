<template>
  <form action="#" method="post" class="layout-form" @submit.prevent="submit">
    <main class="content cart">
      <div class="container">
        <div class="cart__title">
          <h1 class="title title--big">Корзина</h1>
        </div>

        <div v-if="!pizzas.length" class="sheet cart__empty">
          <p>В корзине нет ни одного товара</p>
        </div>

        <template v-else>
          <CartPizzas :pizzas="pizzas" />
          <CartMisc :orderMisc="orderMisc" />
          <CartDelivery />
        </template>
      </div>
    </main>
    <CartFooter :isSubmitDisabled="isSubmitDisabled" />
    <CartPopup v-if="isPopupShowed" />
  </form>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import CartPizzas from "@/modules/cart/components/CartPizzas";
import CartMisc from "@/modules/cart/components/CartMisc";
import CartDelivery from "@/modules/cart/components/CartDelivery";
import CartFooter from "@/modules/cart/components/CartFooter";
import CartPopup from "@/modules/cart/components/CartPopup";
import { RESET_CART } from "@/store/mutations-types";
import { Deliveries } from "@/common/enums";

export default {
  name: "Cart",
  components: {
    CartPizzas,
    CartMisc,
    CartDelivery,
    CartFooter,
    CartPopup,
  },
  data() {
    return {
      isPopupShowed: false,
    };
  },
  computed: {
    ...mapState("Auth", ["user"]),
    ...mapState("Orders", ["orders"]),
    ...mapState("Cart", [
      "pizzas",
      "orderMisc",
      "delivery",
      "phone",
      "address",
    ]),
    ...mapGetters("Cart", ["totalSum"]),

    isSubmitDisabled() {
      if (this.delivery === Deliveries[1]) {
        return !this.totalSum || !this.phone;
      }
      return (
        !this.totalSum ||
        !this.phone ||
        !this.address.street ||
        !this.address.building
      );
    },
  },
  methods: {
    ...mapMutations("Cart", {
      resetCart: RESET_CART,
    }),
    ...mapActions("Orders", ["createOrder"]),

    async submit() {
      await this.createOrder({
        userId: this.user?.id || null,
        phone: this.phone,
        address: this.address,
        pizzas: this.pizzas,
        misc: this.orderMisc,
      });
      this.resetCart();
      this.isPopupShowed = true;
    },
  },
};
</script>
