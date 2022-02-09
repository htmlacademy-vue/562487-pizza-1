<template>
  <div class="content__dough">
    <div class="sheet">
      <h2 class="title title--small sheet__title">Выберите тесто</h2>

      <AppLoader v-if="isLoading" />
      <div v-else class="sheet__content dough">
        <RadioButton
          v-for="dough in doughs"
          :key="dough.id"
          :item="dough"
          :isChecked="dough.id === pizza.doughId"
          @change="setPizzaEntity({ entity: 'doughId', value: $event })"
        >
          <b>{{ dough.name }}</b>
          <span>{{ dough.description }}</span>
        </RadioButton>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { SET_BUILDER_PIZZA_ENTITY } from "@/store/mutations-types";

export default {
  name: "BuilderDoughSelector",
  computed: {
    ...mapState("Builder", ["doughs", "pizza"]),

    isLoading() {
      return !this.doughs.length;
    },
  },
  methods: {
    ...mapMutations("Builder", {
      setPizzaEntity: SET_BUILDER_PIZZA_ENTITY,
    }),
  },
};
</script>
