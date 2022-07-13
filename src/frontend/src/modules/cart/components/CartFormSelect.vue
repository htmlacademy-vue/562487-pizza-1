<template>
  <label class="cart-form__select">
    <span class="cart-form__label">Получение заказа:</span>
    <select
      name="delivery"
      :value="delivery"
      class="select"
      @change="changeDelivery"
    >
      <option
        v-for="{ id, name } in deliveries"
        :key="id"
        :value="id"
      >
        {{ name }}
      </option>
    </select>
  </label>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";

import { BASE_DELIVERIES } from "@/common/constants";
import { createDeliveries } from "@/common/helpers";

export default {
  name: "CartFormSelect",
  computed: {
    ...mapState("Cart", ["delivery", "orderAddress"]),
    ...mapState("Auth", ["addresses"]),
    ...mapGetters("Auth", ["addressById", "isUserAddress"]),

    deliveries() {
      const userDeliveries = createDeliveries(this.addresses);
      return [...BASE_DELIVERIES, ...userDeliveries];
    },
  },

  created() {
    if (
      this.orderAddress &&
      !this.isUserAddress(this.orderAddress.id) &&
      this.delivery !== BASE_DELIVERIES[1].id
    ) {
      this.setDelivery({
        delivery: BASE_DELIVERIES[1].id,
        address: this.orderAddress,
      });
    }
  },

  methods: {
    ...mapActions("Cart", ["setDelivery"]),

    changeDelivery(evt) {
      this.setDelivery({ delivery: evt.target.value });
    },
  },
};
</script>

<style lang="scss" scoped>
.select {
  max-width: 190px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
