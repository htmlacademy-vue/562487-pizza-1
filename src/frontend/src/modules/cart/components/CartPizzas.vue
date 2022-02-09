<template>
  <ul class="cart-list sheet">
    <li v-for="pizza in pizzas" :key="pizza.id" class="cart-list__item">
      <Product class="cart-list__product" :pizza="pizza" />

      <ItemCounter
        class="cart-list__counter"
        :quantity="pizza.quantity"
        @incrementClick="update({ id: pizza.id, quantity: pizza.quantity + 1 })"
        @decrementClick="update({ id: pizza.id, quantity: pizza.quantity - 1 })"
      />

      <div class="cart-list__price">
        <b>{{ pizzaPrice(pizza) * pizza.quantity }} ₽</b>
      </div>

      <div class="cart-list__button">
        <button
          type="button"
          class="cart-list__edit"
          @click="$router.push({ name: 'IndexHome', params: { id: pizza.id } })"
        >
          Изменить
        </button>
      </div>

      <ConfirmPopup
        v-if="isConfirmPopupShowed"
        @confirm="confirmDeletePizza(pizza.id)"
        @cancel="isConfirmPopupShowed = false"
      >
        <h2 class="title">Удалить пиццу {{ pizza.name }}?</h2>
        <p>После удаления пицца не сохранится.</p>
      </ConfirmPopup>
    </li>
  </ul>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import {
  DELETE_PIZZA,
  UPDATE_PIZZA_QUANTITY,
  RESET_CART,
} from "@/store/mutations-types";

export default {
  name: "CartPizzas",
  props: {
    pizzas: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      isConfirmPopupShowed: false,
    };
  },
  computed: {
    ...mapGetters("Builder", ["pizzaPrice"]),
  },
  methods: {
    ...mapMutations("Cart", {
      deletePizza: DELETE_PIZZA,
      updatePizzaQuantity: UPDATE_PIZZA_QUANTITY,
      resetCart: RESET_CART,
    }),

    update({ id, quantity }) {
      if (!quantity) {
        this.isConfirmPopupShowed = true;
        return;
      }
      this.updatePizzaQuantity({ id, quantity });
    },

    confirmDeletePizza(pizzaId) {
      this.isConfirmPopupShowed = false;
      this.deletePizza(pizzaId);
      if (!this.pizzas.length) {
        this.resetCart();
      }
    },
  },
};
</script>
