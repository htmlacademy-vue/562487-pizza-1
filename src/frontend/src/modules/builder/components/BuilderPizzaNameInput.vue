<template>
  <label class="input">
    <span class="visually-hidden">Название пиццы</span>
    <input
      type="text"
      name="pizza_name"
      placeholder="Введите название пиццы"
      :value="pizza.name"
      @input="
        setPizzaEntity({
          entity: 'name',
          value: $event.target.value.trim(),
        })
      "
    />
  </label>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { SET_BUILDER_PIZZA_ENTITY } from "@/store/mutations-types";

export default {
  name: "BuilderPizzaNameInput",
  computed: {
    ...mapState("Builder", ["pizza"]),
  },
  methods: {
    ...mapMutations("Builder", {
      setPizzaEntity: SET_BUILDER_PIZZA_ENTITY,
    }),
  },
};
</script>
