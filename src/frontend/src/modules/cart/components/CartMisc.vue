<template>
  <div class="cart__additional">
    <ul class="additional-list">
      <CartMiscItem
        v-for="item in misc"
        :key="item.miscId"
        :item="item"
        data-test="misc-item"
      />
    </ul>
  </div>
</template>

<script>
import { mapState } from "vuex";
import CartMiscItem from "@/modules/cart/components/CartMiscItem";

export default {
  name: "CartMisc",
  components: {
    CartMiscItem,
  },

  computed: {
    ...mapState("Cart", ["misc"]),
  },
};
</script>
