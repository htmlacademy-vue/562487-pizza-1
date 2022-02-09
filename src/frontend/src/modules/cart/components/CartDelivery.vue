<template>
  <div class="cart__form">
    <div class="cart-form">
      <label class="cart-form__select">
        <span class="cart-form__label">Получение заказа:</span>
        <select
          name="delivery"
          class="select"
          :value="delivery"
          @change="updateDelivery"
        >
          <option v-for="{ id, name } in deliveries" :key="id" :value="id">
            {{ name }}
          </option>
        </select>
      </label>

      <AppInput
        class="input--big-label"
        label="Контактный телефон:"
        name="phone"
        placeholder="+7 999-999-99-99"
        :value="phone"
        @input="setCartEntity({ entity: 'phone', value: $event })"
      />

      <CartFormAddress
        v-if="isAddressShown"
        :address="order.address"
        :isReadOnly="isUserAddress(order.address.id)"
      />
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import CartFormAddress from "./CartFormAddress";
import { BASE_DELIVERIES } from "@/common/constants";
import { Address } from "@/common/models";
import {
  SET_CART_ENTITY,
  SET_CART_ORDER_ENTITY,
} from "@/store/mutations-types";

export default {
  name: "CartDelivery",
  components: {
    CartFormAddress,
  },
  computed: {
    ...mapState("Auth", ["user", "addresses"]),
    ...mapState("Cart", ["delivery", "phone", "order", "deliveries"]),
    ...mapGetters("Auth", ["addressById", "isUserAddress"]),

    isAddressShown() {
      return this.delivery !== BASE_DELIVERIES[0].id;
    },
  },
  methods: {
    ...mapMutations("Cart", {
      setCartEntity: SET_CART_ENTITY,
      setCartOrderEntity: SET_CART_ORDER_ENTITY,
    }),
    ...mapActions("Auth", ["queryAddresses"]),

    updateDelivery(evt) {
      const { value } = evt.target;
      this.setCartEntity({ entity: "delivery", value });

      if (value === BASE_DELIVERIES[0].id) {
        this.setAddress(null);
      } else if (value === BASE_DELIVERIES[1].id) {
        this.setAddress(Address.createNew());
      } else {
        const userAddress = this.addressById(+value);
        if (userAddress) {
          this.setAddress(userAddress);
        }
      }
    },

    setAddress(address) {
      this.setCartOrderEntity({ entity: "address", value: address });
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
