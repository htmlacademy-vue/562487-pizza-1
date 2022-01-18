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
          <option v-for="{ id, name } in deliveries" :key="id" :value="name">
            {{ name }}
          </option>
        </select>
      </label>

      <AppInput
        class="input--big-label"
        label="Контактный телефон:*"
        name="phone"
        placeholder="+7 999-999-99-99"
        :value="phone"
        @input="setCartEntity({ name: 'phone', value: $event.target.value })"
      />

      <CartFormAddress
        v-if="isAddressShown"
        :address="address"
        :isUserAddress="isUserAddress"
      />
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import CartFormAddress from "./CartFormAddress";
import { Deliveries } from "@/common/enums";
import { SET_CART_ENTITY, RESET_ADDRESS } from "@/store/mutations-types";

export default {
  name: "CartDelivery",
  components: {
    CartFormAddress,
  },
  created() {
    if (this.user) {
      this.setCartEntity({ name: "phone", value: this.user.phone });
    }
  },
  computed: {
    ...mapState("Auth", ["user", "addresses"]),
    ...mapState("Cart", ["delivery", "phone", "address"]),

    isAddressShown() {
      return this.delivery !== Deliveries[1];
    },
    isUserAddress() {
      return !Object.values(Deliveries).includes(this.delivery);
    },

    deliveries() {
      const basicDeliveries = Object.keys(Deliveries).map((key) => ({
        id: key,
        name: Deliveries[key],
      }));
      if (!this.user) {
        return basicDeliveries;
      } else {
        const length = Object.keys(Deliveries).length;
        const userDeliveries = this.addresses.map((address, index) => ({
          id: length + index + 1,
          name: address.name,
        }));

        return [...basicDeliveries, ...userDeliveries];
      }
    },
  },
  methods: {
    ...mapMutations("Cart", {
      setCartEntity: SET_CART_ENTITY,
      resetCartAddress: RESET_ADDRESS,
    }),

    updateDelivery(evt) {
      const { value } = evt.target;
      this.setCartEntity({ name: "delivery", value });

      if (value === Deliveries[1]) {
        this.setCartEntity({ name: "address", value: null });
      } else if (value === Deliveries[2]) {
        this.resetCartAddress();
      } else {
        const userAddress = this.addresses.find((it) => it.name === value);
        this.setCartEntity({ name: "address", value: userAddress });
      }
    },
  },
};
</script>
