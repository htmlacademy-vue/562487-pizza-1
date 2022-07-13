<template>
  <li class="cart-list__item">
    <PizzaInfo
      :pizza="pizza"
      class="cart-list__product"
    />

    <ItemCounter
      :quantity="pizza.quantity"
      class="cart-list__counter"
      @increment="incrementPizza(pizza)"
      @decrement="decrementPizza(pizza)"
    />

    <div
      class="cart-list__price"
      data-test="pizza-price"
    >
      <b>{{ pizzaPrice(pizza) * pizza.quantity }} ₽</b>
    </div>

    <div class="cart-list__button">
      <button
        type="button"
        class="cart-list__edit"
        data-test="edit-btn"
        @click="$router.push({ name: 'IndexHome', params: { id: pizza.id } })"
      >
        Изменить
      </button>
    </div>
  </li>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import { UPDATE_PIZZA_QUANTITY } from "@/store/mutations-types";

export default {
  name: "CartPizza",
  props: {
    pizza: {
      type: Object,
      required: true,
    },
  },

  computed: {
    ...mapGetters("Builder", ["pizzaPrice"]),
  },

  methods: {
    ...mapMutations("Cart", {
      updatePizzaQuantity: UPDATE_PIZZA_QUANTITY,
    }),

    incrementPizza({ id, quantity }) {
      this.updatePizzaQuantity({ id, quantity: quantity + 1 });
    },

    decrementPizza({ id, quantity }) {
      if (quantity < 2) {
        this.$emit("delete", id);
        return;
      }
      this.updatePizzaQuantity({ id, quantity: quantity - 1 });
    },
  },
};
</script>
