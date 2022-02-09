<template>
  <div class="cart-form__address">
    <span class="cart-form__label">Новый адрес:</span>

    <div class="cart-form__input">
      <AppInput
        label="Улица*"
        name="street"
        :value="address.street"
        :readonly="isReadOnly"
        @input="updateAddress({ entity: 'street', value: $event })"
      />
    </div>

    <div class="cart-form__input cart-form__input--small">
      <AppInput
        label="Дом*"
        name="building"
        :value="address.building"
        :readonly="isReadOnly"
        @input="updateAddress({ entity: 'building', value: $event })"
      />
    </div>

    <div class="cart-form__input cart-form__input--small">
      <AppInput
        label="Квартира"
        name="flat"
        :value="address.flat"
        :readonly="isReadOnly"
        @input="updateAddress({ entity: 'flat', value: $event })"
      />
    </div>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import { SET_CART_ORDER_ADDRESS_ENTITY } from "@/store/mutations-types";

export default {
  name: "CartFormAddress",
  props: {
    address: {
      type: Object,
      default: null,
    },
    isReadOnly: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
    ...mapMutations("Cart", {
      updateAddress: SET_CART_ORDER_ADDRESS_ENTITY,
    }),
  },
};
</script>
