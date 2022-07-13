<template>
  <form
    action="#"
    method="post"
    class="layout-form"
    @submit.prevent="submit"
  >
    <main class="content cart">
      <div class="container">
        <div class="cart__title">
          <h1 class="title title--big">Корзина</h1>
        </div>

        <div
          v-if="isEmpty"
          class="sheet cart__empty"
          data-test="cart-empty"
        >
          <p>В корзине нет ни одного товара</p>
        </div>

        <div
          v-else
          data-test="cart-content"
        >
          <ul class="cart-list sheet">
            <CartPizza
              v-for="pizza in orderPizzas"
              :key="pizza.id"
              :pizza="pizza"
              @delete="startDeletePizza"
            />
          </ul>
          <CartMisc />
          <CartDelivery />
        </div>
      </div>
    </main>
    <CartFooter
      :is-submit-disabled="isInvalid || isSubmitting"
      :total-sum="totalSum"
    />

    <PopupTransition
      has-callback
      data-test="cart-popup-transition"
      @leave="leavePage"
    >
      <CartPopup
        v-if="isSuccessPopupShowed"
        @close="isSuccessPopupShowed = false"
      />
    </PopupTransition>
    <PopupTransition>
      <ConfirmPopup
        v-if="isConfirmPopupShowed"
        @confirm="confirmDeletePizza"
        @cancel="isConfirmPopupShowed = false"
      >
        <h2 class="title">
          Удалить пиццу {{ orderPizzaNameById(pizzaIdToDelete) }}?
        </h2>
        <p>После удаления пицца не сохранится.</p>
      </ConfirmPopup>
    </PopupTransition>
  </form>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import CartPizza from "@/modules/cart/components/CartPizza";
import CartMisc from "@/modules/cart/components/CartMisc";
import CartDelivery from "@/modules/cart/components/CartDelivery";
import CartFooter from "@/modules/cart/components/CartFooter";
import CartPopup from "@/modules/cart/components/CartPopup";
import { RESET_CART, SET_CART_WITH_ORDER } from "@/store/mutations-types";
import { BASE_DELIVERIES } from "@/common/constants";

export default {
  name: "Cart",
  components: {
    CartPizza,
    CartMisc,
    CartDelivery,
    CartFooter,
    CartPopup,
  },

  data() {
    return {
      isSuccessPopupShowed: false,
      isConfirmPopupShowed: false,
      isSubmitting: false,
      pizzaIdToDelete: null,
    };
  },

  computed: {
    ...mapState("Auth", ["user"]),
    ...mapState("Orders", ["orders"]),

    ...mapState("Cart", [
      "delivery",
      "phone",
      "orderPizzas",
      "orderMisc",
      "orderAddress",
    ]),

    ...mapGetters("Auth", ["isUserAddress"]),
    ...mapGetters("Cart", ["totalSum", "miscById", "orderPizzaNameById"]),
    ...mapGetters("Orders", ["getOrderById"]),

    isEmpty() {
      return this.orderPizzas.length === 0;
    },

    isInvalid() {
      if (this.delivery === BASE_DELIVERIES[0].id) {
        return !this.totalSum || !this.phone;
      }
      return (
        !this.totalSum ||
        !this.orderAddress?.street ||
        !this.orderAddress?.building
      );
    },
  },

  async created() {
    if (!this.user) {
      return;
    }
    const orderId = this.$route?.params?.id;
    if (orderId) {
      await this.queryAddresses();
      const orderToEdit = this.getOrderById(orderId);
      if (!orderToEdit) {
        this.$router.push("/cart");
        return;
      }
      this.setCartWithOrder(orderToEdit);
      return;
    }
    if (!this.isEmpty) {
      await this.queryAddresses();
      return;
    }
  },

  methods: {
    ...mapMutations("Cart", {
      resetCart: RESET_CART,
      setCartWithOrder: SET_CART_WITH_ORDER,
    }),

    ...mapActions("Auth", ["queryAddresses"]),
    ...mapActions("Cart", ["deletePizza"]),
    ...mapActions("Orders", ["createOrder"]),

    startDeletePizza(pizzaId) {
      this.pizzaIdToDelete = pizzaId;
      this.isConfirmPopupShowed = true;
    },

    confirmDeletePizza() {
      this.isConfirmPopupShowed = false;
      this.deletePizza(this.pizzaIdToDelete);
    },

    async submit() {
      this.isSubmitting = true;
      const newOrder = {
        userId: this.user ? this.user.id : null,
        phone: this.phone,
        pizzas: this.orderPizzas.map((pizza) => pizza.toRaw()),
        misc: this.orderMisc,
        address: this.orderAddress,
      };

      try {
        await this.createOrder(newOrder);
        this.resetCart();
        this.isSuccessPopupShowed = true;
      } catch (err) {
        this.isSubmitting = false;
      }
    },

    leavePage() {
      const nextRoute = this.user ? "/orders" : "/";
      this.$router.push(nextRoute);
    },
  },
};
</script>
