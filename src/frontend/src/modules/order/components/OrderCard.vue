<template>
  <section class="sheet order">
    <div class="order__wrapper">
      <div class="order__number">
        <b>Заказ #{{ order.id }}</b>
      </div>

      <div class="order__sum">
        <span>Сумма заказа: {{ totalPrice(order.id) }} ₽</span>
      </div>

      <div class="order__button">
        <AppButton class="button--border" @click="toggleConfirmPopup">
          Удалить
        </AppButton>
      </div>
      <div class="order__button" @click="handleRepeat">
        <AppButton>Повторить</AppButton>
      </div>
    </div>

    <ul class="order__list">
      <li v-for="pizza in order.pizzas" :key="pizza.id" class="order__item">
        <Product :pizza="pizza" />

        <p class="order__price">
          {{ pizza.quantity }} х {{ pizzaPrice(pizza) }} ₽
        </p>
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
      Адрес доставки: {{ order.address.name }}
    </p>

    <ConfirmPopup
      v-if="isConfirmPopupShowed"
      :isSubmitting="isSubmitting"
      @confirm="confirmDelete"
      @cancel="toggleConfirmPopup"
    >
      <h2 class="title">Удалить заказ #{{ order.id }}?</h2>
      <p>После удаления заказ не сохранится.</p>
    </ConfirmPopup>
  </section>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
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
  data() {
    return {
      isConfirmPopupShowed: false,
      isSubmitting: false,
    };
  },
  computed: {
    ...mapState("Cart", ["misc"]),
    ...mapGetters("Builder", ["pizzaPrice"]),
    ...mapGetters("Orders", ["totalPrice"]),
  },
  methods: {
    ...mapActions("Orders", ["deleteOrder"]),

    toggleConfirmPopup() {
      this.isConfirmPopupShowed = !this.isConfirmPopupShowed;
    },

    async confirmDelete() {
      this.isSubmitting = true;
      const id = this.order.id;
      try {
        await this.deleteOrder(id);
        const message = `Заказ ${id} успешно удалён`;
        this.$notifier.success(message);
      } catch {
        this.isSubmitting = false;
      }
    },

    handleRepeat() {
      this.$router.push({ name: "Cart", params: { id: this.order.id } });
    },
  },
};
</script>
