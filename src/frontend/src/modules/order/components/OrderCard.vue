<template>
  <section class="sheet order">
    <div class="order__wrapper">
      <div class="order__number">
        <b>Заказ #{{ order.id }}</b>
      </div>

      <div class="order__sum">
        <span>Сумма заказа: {{ totalPrice(order) }} ₽</span>
      </div>

      <div class="order__button">
        <AppButton
          class="button--border"
          @click="$emit('deleteOrder', order.id)"
        >
          Удалить
        </AppButton>
      </div>
      <div class="order__button" @click="handleRepeat">
        <AppButton>Повторить</AppButton>
      </div>
    </div>

    <ul class="order__list">
      <li
        v-for="pizza in order.orderPizzas"
        :key="pizza.id"
        class="order__item"
      >
        <Product :pizza="pizza" />

        <p class="order__price">
          {{ pizza.quantity }} х {{ pizzaPrice(pizza) }} ₽
        </p>
      </li>
    </ul>

    <ul v-if="order.orderMisc.length" class="order__additional">
      <OrderMisc
        v-for="orderMisc in order.orderMisc"
        :key="orderMisc.miscId"
        :orderMisc="orderMisc"
      />
    </ul>

    <p v-if="order.orderAddress" class="order__address">
      Адрес доставки: {{ order.orderAddress.name }}
    </p>
  </section>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import OrderMisc from "./OrderMisc";

export default {
  name: "OrderCard",
  components: { OrderMisc },
  props: {
    order: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapState("Cart", ["misc"]),
    ...mapGetters("Builder", ["pizzaPrice"]),
    ...mapGetters("Orders", ["totalPrice"]),
  },
  methods: {
    handleRepeat() {
      this.$router.push({ name: "Cart", params: { id: this.order.id } });
    },
  },
};
</script>
