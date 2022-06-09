<template>
  <div class="cart__form">
    <div class="cart-form">
      <CartFormSelect />
      <CartFormPhone />
      <CartFormAddress v-if="isAddressShown" />
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import CartFormSelect from "./CartFormSelect";
import CartFormPhone from "./CartFormPhone";
import CartFormAddress from "./CartFormAddress";
import { BASE_DELIVERIES } from "@/common/constants";

export default {
  name: "CartDelivery",
  components: {
    CartFormSelect,
    CartFormPhone,
    CartFormAddress,
  },
  computed: {
    ...mapState("Cart", ["delivery"]),

    isAddressShown() {
      return this.delivery !== BASE_DELIVERIES[0].id;
    },
  },
};
</script>
