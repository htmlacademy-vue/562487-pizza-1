<template>
  <label class="cart-form__select">
    <span class="cart-form__label">Получение заказа:</span>
    <select
      name="delivery"
      class="select"
      :value="delivery"
      @change="updateDelivery"
      data-test="delivery-select"
    >
      <option v-for="{ id, name } in deliveries" :key="id" :value="id">
        {{ name }}
      </option>
    </select>
  </label>
</template>

<script>
import { mapState, mapGetters, mapMutations } from "vuex";

import { BASE_DELIVERIES } from "@/common/constants";
import { SET_CART_ENTITY } from "@/store/mutations-types";
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
    if (this.orderAddress && !this.isUserAddress(this.orderAddress.id)) {
      this.setDelivery(BASE_DELIVERIES[1].id);
      this.setAddress({
        street: this.orderAddress.street,
        building: this.orderAddress.building,
        flat: this.orderAddress?.flat || "",
      });
    }
  },
  methods: {
    ...mapMutations("Cart", {
      setCartEntity: SET_CART_ENTITY,
    }),

    setAddress(value) {
      this.setCartEntity({ entity: "orderAddress", value });
    },

    setDelivery(value) {
      this.setCartEntity({ entity: "delivery", value });
    },

    updateDelivery(evt) {
      const { value } = evt.target;
      this.setDelivery(value);
      if (value === BASE_DELIVERIES[0].id) {
        this.setAddress(null);
      } else if (value === BASE_DELIVERIES[1].id) {
        this.setAddress({
          street: "",
          building: "",
          flat: "",
        });
      } else {
        const userAddress = this.addressById(+value);
        if (userAddress) {
          this.setAddress(userAddress);
        }
      }
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
