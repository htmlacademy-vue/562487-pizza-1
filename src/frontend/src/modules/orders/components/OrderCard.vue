<template>
  <section class="sheet order">
    <div class="order__wrapper">
      <div
        class="order__number"
        data-test="order-number"
      >
        <b>Заказ #{{ order.id }}</b>
      </div>

      <div
        class="order__sum"
        data-test="order-sum"
      >
        <span>Сумма заказа: {{ totalPrice(order) }} ₽</span>
      </div>

      <div class="order__button">
        <AppButton
          class="button--border"
          data-test="button-delete"
          @click="$emit('delete', order.id)"
        >
          Удалить
        </AppButton>
      </div>
      <div class="order__button">
        <AppButton
          data-test="button-repeat"
          @click="handleRepeat"
        >
          Повторить
        </AppButton>
      </div>
    </div>

    <ul class="order__list">
      <OrderPizza
        v-for="pizza in order.orderPizzas"
        :key="pizza.id"
        :pizza="pizza"
      />
    </ul>

    <ul
      v-if="order.orderMisc.length"
      class="order__additional"
    >
      <OrderMisc
        v-for="orderMisc in order.orderMisc"
        :key="orderMisc.miscId"
        :order-misc="orderMisc"
      />
    </ul>

    <p
      v-if="order.orderAddress"
      class="order__address"
      data-test="order-address"
    >
      Адрес доставки: {{ order.orderAddress.name }}
    </p>
  </section>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import OrderPizza from "./OrderPizza";
import OrderMisc from "./OrderMisc";

export default {
  name: "OrderCard",
  components: { OrderPizza, OrderMisc },
  props: {
    order: {
      type: Object,
      required: true,
    },
  },

  computed: {
    ...mapState("Cart", ["misc"]),

    ...mapGetters("Orders", ["totalPrice"]),
  },

  methods: {
    handleRepeat() {
      this.$router.push({ name: "Cart", params: { id: this.order.id } });
    },
  },
};
</script>
