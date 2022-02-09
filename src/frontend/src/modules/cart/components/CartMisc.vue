<template>
  <div class="cart__additional">
    <ul class="additional-list">
      <li
        v-for="{ id, name, image, price } in misc"
        :key="id"
        class="additional-list__item sheet"
      >
        <p class="additional-list__description">
          <img :src="image" width="39" height="60" :alt="name" />
          <span>{{ name }}</span>
        </p>

        <div class="additional-list__wrapper">
          <ItemCounter
            class="additional-list__counter"
            :quantity="miscQuantityById(id)"
            @incrementClick="
              updateOrderMisc({
                miscId: id,
                quantity: miscQuantityById(id) + 1,
              })
            "
            @decrementClick="
              updateOrderMisc({
                miscId: id,
                quantity: miscQuantityById(id) - 1,
              })
            "
          />

          <div class="additional-list__price">
            <b>× {{ price * miscQuantityById(id) }} ₽</b>
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
  props: {
    orderMisc: {
      type: Array,
      required: true,
    },
  },
  computed: {
    ...mapState("Cart", ["misc"]),
    ...mapGetters("Cart", ["miscQuantityById"]),
  },
  methods: {
    ...mapMutations("Cart", { updateOrderMisc: UPDATE_CART_ORDER_MISC }),
  },
};
</script>
