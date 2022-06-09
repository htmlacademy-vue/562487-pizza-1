<template>
  <form action="#" method="post" class="layout-form" @submit.prevent="submit">
    <main class="content cart">
      <div class="container">
        <div class="cart__title">
          <h1 class="title title--big">Корзина</h1>
        </div>

        <div v-if="isEmpty" class="sheet cart__empty">
          <p>В корзине нет ни одного товара</p>
        </div>

        <div v-else>
          <CartPizzas :pizzas="orderPizzas" @deletePizza="startDeletePizza" />
          <CartMisc :orderMisc="orderMisc" />
          <CartDelivery />
        </div>
      </div>
    </main>
    <CartFooter :isSubmitDisabled="isInvalid || isSubmitting" />

    <PopupTransition hasCallback @leave="leavePage">
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
import {
  SET_CART_ENTITY,
  RESET_CART,
  DELETE_PIZZA,
} from "@/store/mutations-types";
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
    const orderId = this.$route.params.id;
    if (this.user && orderId) {
      await this.queryAddresses();
      this.setupCartWithOrder(orderId);
      return;
    }
    if (this.user && !this.isEmpty) {
      await this.queryAddresses();
    }
  },
  methods: {
    ...mapMutations("Cart", {
      setCartEntity: SET_CART_ENTITY,
      resetCart: RESET_CART,
      deletePizza: DELETE_PIZZA,
    }),
    ...mapActions("Auth", ["queryAddresses"]),
    ...mapActions("Orders", ["createOrder"]),

    setCartOrderPizzas(value) {
      this.setCartEntity({ entity: "orderPizzas", value });
    },
    setCartOrderMisc(value) {
      this.setCartEntity({ entity: "orderMisc", value });
    },
    setAddress(value) {
      this.setCartEntity({ entity: "orderAddress", value });
    },
    setDelivery(value) {
      this.setCartEntity({ entity: "delivery", value });
    },
    setPhone(value) {
      this.setCartEntity({ entity: "phone", value });
    },

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
        this.$route.push("/cart");
        return;
      }
      this.setDelivery(orderToEdit.orderAddress?.id || BASE_DELIVERIES[0].id);
      this.setPhone(orderToEdit.phone);
      this.setAddress(orderToEdit.orderAddress);
      const cartOrderPizzas = Pizza.parseItems(orderToEdit.orderPizzas);
      this.setCartOrderPizzas(cartOrderPizzas);
      this.setCartOrderMisc(orderToEdit.orderMisc);
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
        console.log(err);
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
