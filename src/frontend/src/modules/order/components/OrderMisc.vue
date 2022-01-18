<template>
  <li>
    <img :src="miscItem.image" width="20" height="30" :alt="miscItem.name" />
    <p>
      <span>{{ miscItem.name }}</span>
      <b>{{ orderMisc.quantity }} х {{ miscItem.price }} ₽</b>
    </p>
  </li>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "OrderMisc",
  props: {
    orderMisc: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapGetters("Cart", ["miscById"]),

    miscItem() {
      const id = this.orderMisc.miscId;
      return this.miscById(id);
    },
  },
};
</script>
