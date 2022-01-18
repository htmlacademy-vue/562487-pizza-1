<template>
  <ul class="cart-list sheet">
    <li v-for="pizza in pizzas" :key="pizza.id" class="cart-list__item">
      <Product class="cart-list__product" :pizza="pizza" />

      <ItemCounter
        class="cart-list__counter"
        :quantity="pizza.quantity"
        @incrementClick="update({ ...pizza, quantity: pizza.quantity + 1 })"
        @decrementClick="update({ ...pizza, quantity: pizza.quantity - 1 })"
      />

      <div class="cart-list__price">
        <b>{{ pizza.price * pizza.quantity }} ₽</b>
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
import { mapMutations } from "vuex";
import {
  DELETE_PIZZA,
  UPDATE_PIZZA,
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
  methods: {
    ...mapMutations("Cart", {
      deletePizza: DELETE_PIZZA,
      updatePizza: UPDATE_PIZZA,
      resetCart: RESET_CART,
    }),

    update(pizza) {
      if (!pizza.quantity) {
        this.isConfirmPopupShowed = true;
        return;
      }
      this.updatePizza(pizza);
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
