<template>
  <div class="cart-form__address">
    <span class="cart-form__label">Новый адрес:</span>

    <div class="cart-form__input">
      <AppInput
        label="Улица*"
        name="street"
        :value="address.street"
        :readonly="isUserAddress"
        @input="updateAddress"
      />
    </div>

    <div class="cart-form__input cart-form__input--small">
      <AppInput
        label="Дом*"
        name="building"
        :value="address.building"
        :readonly="isUserAddress"
        @input="updateAddress"
      />
    </div>

    <div class="cart-form__input cart-form__input--small">
      <AppInput
        label="Квартира"
        name="flat"
        :value="address.flat"
        :readonly="isUserAddress"
        @input="updateAddress"
      />
    </div>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import { SET_CART_ENTITY } from "@/store/mutations-types";

export default {
  name: "CartFormAddress",
  props: {
    address: {
      type: Object,
      default: null,
    },
    isUserAddress: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
    ...mapMutations("Cart", {
      setCartEntity: SET_CART_ENTITY,
    }),

    updateAddress(evt) {
      const { name, value } = evt.target;
      const updatedAddress = { ...this.address, [name]: value };
      this.setCartEntity({ name: "address", value: updatedAddress });
    },
  },
};
</script>
