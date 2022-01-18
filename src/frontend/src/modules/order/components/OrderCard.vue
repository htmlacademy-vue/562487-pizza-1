<template>
  <section class="sheet order">
    <div class="order__wrapper">
      <div class="order__number">
        <b>Заказ #{{ orderNumber }}</b>
      </div>

      <div class="order__sum">
        <span>Сумма заказа: {{ totalPrice }} ₽</span>
      </div>

      <div class="order__button">
        <AppButton class="button--border" @click="isConfirmPopupShowed = true">
          Удалить
        </AppButton>
      </div>
      <div class="order__button">
        <AppButton>Повторить</AppButton>
      </div>
    </div>

    <ul class="order__list">
      <li v-for="pizza in order.pizzas" :key="pizza.id" class="order__item">
        <Product :pizza="pizza" />

        <p class="order__price">{{ pizza.quantity }} х {{ pizza.price }} ₽</p>
      </li>
    </ul>

    <ul v-if="order.misc.length" class="order__additional">
      <OrderMisc
        v-for="orderMisc in order.misc"
        :key="orderMisc.miscId"
        :orderMisc="orderMisc"
      />
    </ul>

    <p v-if="order.address" class="order__address">
      Адрес доставки: ул. {{ order.address.street }}, д.
      {{ order.address.building }},
      {{ order.address.flat && `кв. ${order.address.flat}` }}
    </p>

    <ConfirmPopup
      v-if="isConfirmPopupShowed"
      :entity="order"
      @confirm="confirmDeleteOrder"
      @cancel="isConfirmPopupShowed = false"
    >
      <h2 class="title">Удалить заказ #{{ orderNumber }}?</h2>
      <p>После удаления заказ не сохранится.</p>
    </ConfirmPopup>
  </section>
</template>

<script>
import { mapState, mapActions } from "vuex";
import OrderMisc from "./OrderMisc";
import { calculateSum, findById } from "@/common/helpers";

export default {
  name: "OrderCard",
  components: { OrderMisc },
  props: {
    order: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      isConfirmPopupShowed: false,
    };
  },
  computed: {
    ...mapState("Cart", ["misc"]),

    orderNumber() {
      return this.order.id.replace("order_", "");
    },
    pizzasPrice() {
      return calculateSum(this.order.pizzas);
    },
    miscPrice() {
      return this.order.misc
        .map(({ miscId, quantity }) => {
          const miscItem = findById(this.misc, miscId);
          return miscItem.price * quantity;
        })
        .reduce((acc, it) => acc + it, 0);
    },
    totalPrice() {
      return this.pizzasPrice + this.miscPrice;
    },
  },
  methods: {
    ...mapActions("Orders", ["deleteOrder"]),

    async confirmDeleteOrder() {
      await this.deleteOrder(this.order.id);
    },
  },
};
</script>
