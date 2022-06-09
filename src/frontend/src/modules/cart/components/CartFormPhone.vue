<template>
  <AppInput
    class="input--big-label"
    label="Контактный телефон:"
    name="phone"
    placeholder="+7 999-999-99-99"
    :value="phone"
    @input="setPhone"
  />
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { SET_CART_ENTITY } from "@/store/mutations-types";

export default {
  name: "CartFormPhone",
  computed: {
    ...mapState("Cart", ["phone"]),
  },
  methods: {
    ...mapMutations("Cart", {
      setCartEntity: SET_CART_ENTITY,
    }),
    setPhone(value) {
      this.setCartEntity({ entity: "phone", value });
    },
  },
};
</script>
