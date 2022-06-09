<template>
  <AppLayoutContent>
    <div class="layout__title">
      <h1 class="title title--big">История заказов</h1>
    </div>
    <SlideTransitionGroup>
      <OrderCard
        v-for="order in orders"
        :key="order.id"
        :order="order"
        @deleteOrder="startOrderDelete"
      />
    </SlideTransitionGroup>
    <PopupTransition>
      <ConfirmPopup
        v-if="isConfirmPopupShowed"
        :isSubmitting="isSubmitting"
        @confirm="confirmDeleteOrder"
        @cancel="closeConfirmPopup"
      >
        <h2 class="title">Удалить заказ #{{ orderIdToDelete }}?</h2>
        <p>После удаления заказ не сохранится.</p>
      </ConfirmPopup>
    </PopupTransition>
  </AppLayoutContent>
</template>

<script>
import { mapActions, mapState } from "vuex";
import AppLayoutContent from "@/layouts/AppLayoutContent";
import OrderCard from "@/modules/order/components/OrderCard";

export default {
  name: "Orders",
  components: { AppLayoutContent, OrderCard },
  data() {
    return {
      isConfirmPopupShowed: false,
      isSubmitting: false,
      orderIdToDelete: null,
    };
  },
  computed: {
    ...mapState("Orders", ["orders"]),
  },
  async created() {
    await this.queryOrders();
  },
  methods: {
    ...mapActions("Orders", ["queryOrders", "deleteOrder"]),

    closeConfirmPopup() {
      this.isConfirmPopupShowed = false;
    },

    startOrderDelete(orderId) {
      this.isConfirmPopupShowed = true;
      this.orderIdToDelete = orderId;
    },

    async confirmDeleteOrder() {
      this.isSubmitting = true;
      try {
        await this.deleteOrder(this.orderIdToDelete);
        const message = `Заказ ${this.orderIdToDelete} успешно удалён`;
        this.$notifier.success(message);
        this.isSubmitting = false;
        this.closeConfirmPopup();
      } catch {
        this.isSubmitting = false;
      }
    },
  },
};
</script>
