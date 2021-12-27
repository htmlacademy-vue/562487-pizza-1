<template>
  <div class="layout__content">
    <div class="layout__title">
      <h1 class="title title--big">История заказов</h1>
    </div>

    <div v-if="orders.length">
      <section v-for="order in orders" :key="order.id" class="sheet order">
        <div class="order__wrapper">
          <div class="order__number">
            <b>Заказ #{{ order.number }}</b>
          </div>

          <div class="order__sum">
            <span>Сумма заказа: {{ order.total }} ₽</span>
          </div>

          <div class="order__button">
            <button
              type="button"
              class="button button--border"
              @click="$emit('removeOrder', order.id)"
            >
              Удалить
            </button>
          </div>
          <div class="order__button">
            <button type="button" class="button">Повторить</button>
          </div>
        </div>

        <ul class="order__list">
          <li v-for="pizza in order.pizzas" :key="pizza.id" class="order__item">
            <Product :pizza="pizza" />

            <p class="order__price">{{ pizza.count }} х {{ pizza.price }} ₽</p>
          </li>
        </ul>

        <ul v-if="order.addons.length" class="order__additional">
          <Addon v-for="addon in order.addons" :key="addon.id" :addon="addon" />
        </ul>

        <p class="order__address">
          Адрес доставки: Тест (или если адрес новый - писать целиком)
        </p>
      </section>
    </div>
  </div>
</template>

<script>
import Product from "@/common/components/Product";
import Addon from "@/common/components/Addon";

export default {
  name: "Orders",
  components: { Product, Addon },
  props: {
    orders: {
      type: Array,
      required: true,
    },
  },
};
</script>
