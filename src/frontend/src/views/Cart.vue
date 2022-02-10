<template>
  <form action="#" method="post" class="layout-form" @submit.prevent="submit">
    <main class="content cart">
      <div class="container">
        <div class="cart__title">
          <h1 class="title title--big">Корзина</h1>
        </div>

        <div v-if="!order.pizzas.length" class="sheet cart__empty">
          <p>В корзине нет ни одного товара</p>
        </div>

        <template v-else>
          <CartPizzas :pizzas="order.pizzas" />
          <CartMisc :orderMisc="order.misc" />
          <CartDelivery />
        </template>
      </div>
    </main>
    <CartFooter :isSubmitDisabled="isInvalid || isSubmitting" />
    <CartPopup v-if="isPopupShowed" @close="closePopup" />
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
  SET_CART_ORDER_ENTITY,
  RESET_CART,
} from "@/store/mutations-types";
import { BASE_DELIVERIES } from "@/common/constants";

const createDeliveries = (items) => {
  return items.map((it) => ({
    id: it.id,
    name: it.name,
  }));
};

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
      isSubmitting: false,
    };
  },
  computed: {
    ...mapState("Auth", ["user", "addresses"]),
    ...mapState("Orders", ["orders"]),
    ...mapState("Cart", ["delivery", "phone", "order", "deliveries"]),
    ...mapGetters("Auth", ["isUserAddress"]),
    ...mapGetters("Cart", ["totalSum"]),
    ...mapGetters("Orders", ["getOrderById"]),

    isInvalid() {
      if (this.delivery === BASE_DELIVERIES[0].id) {
        return !this.totalSum || !this.phone;
      }
      return (
        !this.totalSum ||
        !this.order.address.street ||
        !this.order.address.building
      );
    },
  },

  async created() {
    if (this.user && this.order.pizzas.length) {
      await this.queryAddresses();
    }
    const orderId = this.$route.params.id;
    if (orderId) {
      this.setupCartWithOrder(orderId);
    } else {
      this.setupDeliveries();
    }
  },
  methods: {
    ...mapMutations("Cart", {
      setCartEntity: SET_CART_ENTITY,
      setCartOrderEntity: SET_CART_ORDER_ENTITY,
      resetCart: RESET_CART,
    }),
    ...mapActions("Auth", ["queryAddresses"]),
    ...mapActions("Orders", ["createOrder"]),

    setupDeliveries() {
      const userDeliveries = createDeliveries(this.addresses);
      this.setCartEntity({
        entity: "deliveries",
        value: [...BASE_DELIVERIES, ...userDeliveries],
      });
    },

    setupCartWithOrder(orderId) {
      const orderToEdit = this.getOrderById(orderId);
      if (!orderToEdit) {
        this.$route.push("/cart");
        return;
      }
      this.setupDeliveries();
      this.setCartEntity({ entity: "order", value: orderToEdit });
      this.setCartEntity({ entity: "phone", value: orderToEdit.phone });
      if (orderToEdit.address) {
        this.setCartEntity({
          entity: "delivery",
          value: orderToEdit.address.id,
        });
      }
    },

    closePopup() {
      if (this.user) {
        this.$router.push("/orders");
      } else {
        this.$router.push("/");
      }
    },

    async submit() {
      this.isSubmitting = true;
      const addressId = this.order.address?.id;
      const isUserAddress = this.isUserAddress(addressId);
      const address = addressId
        ? isUserAddress
          ? this.order.address
          : this.order.address.toOrderRaw()
        : null;
      try {
        await this.createOrder({
          userId: this.user ? this.user.id : null,
          phone: this.phone,
          pizzas: this.order.pizzas.map((pizza) => pizza.toRaw()),
          misc: this.order.misc,
          address,
        });
        this.resetCart();
        this.isPopupShowed = true;
      } catch {
        this.isSubmitting = false;
      }
    },
  },
};
</script>
