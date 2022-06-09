<template>
  <div class="cart__additional">
    <ul class="additional-list">
      <li
        v-for="{ miscId, name, image, price } in misc"
        :key="miscId"
        class="additional-list__item sheet"
      >
        <p class="additional-list__description">
          <img :src="image" width="39" height="60" :alt="name" />
          <span>{{ name }}</span>
        </p>

        <div class="additional-list__wrapper">
          <ItemCounter
            class="additional-list__counter"
            :quantity="orderMiscQuantityById(miscId)"
            @incrementClick="
              updateOrderMisc({
                miscId,
                quantity: orderMiscQuantityById(miscId) + 1,
              })
            "
            @decrementClick="
              updateOrderMisc({
                miscId,
                quantity: orderMiscQuantityById(miscId) - 1,
              })
            "
          />

          <div class="additional-list__price">
            <b>× {{ price * orderMiscQuantityById(miscId) }} ₽</b>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from "vuex";
import { UPDATE_CART_ORDER_MISC } from "@/store/mutations-types";

export default {
  name: "CartMisc",
  computed: {
    ...mapState("Cart", ["misc"]),
    ...mapGetters("Cart", ["orderMiscQuantityById"]),
  },
  methods: {
    ...mapMutations("Cart", { updateOrderMisc: UPDATE_CART_ORDER_MISC }),
  },
};
</script>
