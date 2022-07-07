<template>
  <form action="#" method="post" @submit.prevent="submit">
    <div class="content__wrapper">
      <h1 class="title title--big">Конструктор пиццы</h1>
      <BuilderDoughSelector />
      <BuilderSizeSelector />
      <BuilderIngredientsSelector />
      <div class="content__pizza">
        <AppInput
          name="pizza_name"
          label="Название пиццы"
          labelIsHidden
          placeholder="Введите название пиццы"
          :value="pizza.name"
          @input="setName"
          data-test="pizza-name"
        />
        <BuilderPizzaView />
        <BuilderPizzaResult />
      </div>
    </div>
  </form>
</template>

<script>
import { mapState, mapMutations } from "vuex";

import BuilderDoughSelector from "./BuilderDoughSelector";
import BuilderSizeSelector from "./BuilderSizeSelector";
import BuilderIngredientsSelector from "./BuilderIngredientsSelector";
import BuilderPizzaView from "./BuilderPizzaView";
import BuilderPizzaResult from "./BuilderPizzaResult";
import {
  ADD_PIZZA,
  UPDATE_PIZZA,
  RESET_BUILDER_PIZZA,
  SET_BUILDER_PIZZA_ENTITY,
} from "@/store/mutations-types";

export default {
  name: "Builder",
  components: {
    BuilderDoughSelector,
    BuilderSizeSelector,
    BuilderIngredientsSelector,
    BuilderPizzaView,
    BuilderPizzaResult,
  },
  props: {
    isEditMode: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    ...mapState("Builder", ["pizza"]),
  },
  methods: {
    ...mapMutations("Builder", {
      setPizzaEntity: SET_BUILDER_PIZZA_ENTITY,
      resetPizza: RESET_BUILDER_PIZZA,
    }),
    ...mapMutations("Cart", {
      addPizza: ADD_PIZZA,
      updatePizza: UPDATE_PIZZA,
    }),

    setName(value) {
      this.setPizzaEntity({
        entity: "name",
        value: value.trim(),
      });
    },

    submit() {
      if (this.isEditMode) {
        this.updatePizza(this.pizza);
        this.$emit("saveEdit");
        this.$router.push("/cart");
      } else {
        this.addPizza(this.pizza);
      }
      let message = `Пицца ${this.pizza.name}`;
      message += this.isEditMode ? " обновлена" : " создана";
      this.$notifier.success(message);
      this.resetPizza();
    },
  },
};
</script>
