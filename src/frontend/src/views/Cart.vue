<template>
  <form action="#" method="post" class="layout-form" @submit.prevent="submit">
    <main class="content cart">
      <div class="container">
        <div class="cart__title">
          <h1 class="title title--big">Корзина</h1>
        </div>

        <div v-if="isEmpty" class="sheet cart__empty" data-test="cart-empty">
          <p>В корзине нет ни одного товара</p>
        </div>

        <div v-else data-test="cart-content">
          <CartPizzas :pizzas="orderPizzas" @deletePizza="startDeletePizza" />
          <CartMisc />
          <CartDelivery />
        </div>
      </div>
    </main>
    <CartFooter
      :isSubmitDisabled="isInvalid || isSubmitting"
      :totalSum="totalSum"
    />

    <PopupTransition
      hasCallback
      @leave="leavePage"
      data-test="cart-popup-transition"
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
import CartPizzas from "@/modules/cart/components/CartPizzas";
import CartMisc from "@/modules/cart/components/CartMisc";
import CartDelivery from "@/modules/cart/components/CartDelivery";
import CartFooter from "@/modules/cart/components/CartFooter";
import CartPopup from "@/modules/cart/components/CartPopup";
import { RESET_CART, DELETE_PIZZA, UPDATE_CART } from "@/store/mutations-types";
import { BASE_DELIVERIES } from "@/common/constants";
import { Pizza } from "@/common/models";

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
      this.setupCartWithOrder(orderId);
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
      deletePizza: DELETE_PIZZA,
      updateCart: UPDATE_CART,
    }),
    ...mapActions("Auth", ["queryAddresses"]),
    ...mapActions("Orders", ["createOrder"]),

    startDeletePizza(pizzaId) {
      this.pizzaIdToDelete = pizzaId;
      this.isConfirmPopupShowed = true;
    },

    confirmDeletePizza() {
      this.isConfirmPopupShowed = false;
      this.deletePizza(this.pizzaIdToDelete);
      if (!this.orderPizzas.length) {
        this.resetCart();
      }
    },

    setupCartWithOrder(orderId) {
      const orderToEdit = this.getOrderById(orderId);
      if (!orderToEdit) {
        this.$router.push("/cart");
        return;
      }
      this.updateCart({
        delivery: orderToEdit.orderAddress?.id || BASE_DELIVERIES[0].id,
        phone: orderToEdit.phone,
        orderAddress: orderToEdit.orderAddress,
        orderPizzas: Pizza.parseItems(orderToEdit.orderPizzas),
        orderMisc: orderToEdit.orderMisc,
      });
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
