<template>
  <div class="content__dough">
    <div class="sheet">
      <h2 class="title title--small sheet__title">Выберите тесто</h2>

      <div class="sheet__content dough">
        <RadioButton
          v-for="dough in doughs"
          :key="dough.id"
          :item="dough"
          :checkedItem="checkedDough"
          @change="$emit('doughChange', $event)"
        >
          <b>{{ dough.name }}</b>
          <span>{{ dough.description }}</span>
        </RadioButton>
      </div>
    </div>
  </div>
</template>

<script>
import RadioButton from "@/common/components/RadioButton";

export default {
  name: "BuilderDoughSelector",
  components: { RadioButton },
  props: {
    doughs: {
      type: Array,
      required: true,
    },
    checkedDough: {
      type: [Number, String],
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped></style>
