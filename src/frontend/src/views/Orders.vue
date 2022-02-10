<template>
  <div class="layout__content">
    <div class="layout__title">
      <h1 class="title title--big">История заказов</h1>
    </div>
    <div v-if="this.orders.length">
      <OrderCard v-for="order in orders" :key="order.id" :order="order" />
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import OrderCard from "@/modules/order/components/OrderCard";

export default {
  name: "Orders",
  components: { OrderCard },
  computed: {
    ...mapState("Orders", ["orders"]),
  },
  async created() {
    await this.queryOrders();
  },
  methods: {
    ...mapActions("Orders", ["queryOrders"]),
  },
};
</script>
