<template>
  <div class="cart-form__address">
    <span class="cart-form__label">Новый адрес:</span>

    <div class="cart-form__input">
      <AppInput
        label="Улица*"
        name="street"
        :value="orderAddress.street"
        :readonly="isReadOnly"
        @input="updateAddress({ entity: 'street', value: $event })"
        data-test="input-street"
      />
    </div>

    <div class="cart-form__input cart-form__input--small">
      <AppInput
        label="Дом*"
        name="building"
        :value="orderAddress.building"
        :readonly="isReadOnly"
        @input="updateAddress({ entity: 'building', value: $event })"
        data-test="input-building"
      />
    </div>

    <div class="cart-form__input cart-form__input--small">
      <AppInput
        label="Квартира"
        name="flat"
        :value="orderAddress.flat"
        :readonly="isReadOnly"
        @input="updateAddress({ entity: 'flat', value: $event })"
        data-test="input-flat"
      />
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters } from "vuex";
import { SET_CART_ORDER_ADDRESS_ENTITY } from "@/store/mutations-types";

export default {
  name: "CartFormAddress",
  computed: {
    ...mapState("Cart", ["orderAddress"]),
    ...mapGetters("Auth", ["isUserAddress"]),

    isReadOnly() {
      if (this.orderAddress?.id) {
        return this.isUserAddress(this.orderAddress.id);
      }
      return false;
    },
  },
  methods: {
    ...mapMutations("Cart", {
      updateAddress: SET_CART_ORDER_ADDRESS_ENTITY,
    }),
  },
};
</script>
