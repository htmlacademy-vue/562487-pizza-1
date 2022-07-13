<template>
  <li class="additional-list__item sheet">
    <p
      class="additional-list__description"
      data-test="misc-description"
    >
      <img
        :src="image"
        width="39"
        height="60"
        :alt="name"
      />
      <span>{{ name }}</span>
    </p>

    <div class="additional-list__wrapper">
      <ItemCounter
        class="additional-list__counter"
        :quantity="orderMiscQuantityById(miscId)"
        @increment="
          updateOrderMisc({
            miscId,
            quantity: orderMiscQuantityById(miscId) + 1,
          })
        "
        @decrement="
          updateOrderMisc({
            miscId,
            quantity: orderMiscQuantityById(miscId) - 1,
          })
        "
      />

      <div
        class="additional-list__price"
        data-test="misc-price"
      >
        <b>× {{ price * orderMiscQuantityById(miscId) }} ₽</b>
      </div>
    </div>
  </li>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import { UPDATE_CART_ORDER_MISC } from "@/store/mutations-types";

export default {
  name: "CartMiscItem",
  props: {
    item: {
      type: Object,
      required: true,
    },
  },

  computed: {
    ...mapGetters("Cart", ["orderMiscQuantityById"]),

    miscId() {
      return this.item.miscId;
    },

    name() {
      return this.item.name;
    },

    image() {
      return this.item.image;
    },

    price() {
      return this.item.price;
    },
  },

  methods: {
    ...mapMutations("Cart", { updateOrderMisc: UPDATE_CART_ORDER_MISC }),
  },
};
</script>
