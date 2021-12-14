<template>
  <label :class="radioButtonClasses">
    <input
      type="radio"
      :name="item.kind"
      :value="item.value"
      class="visually-hidden"
      :checked="item.id === checkedItem"
      @change="$emit('change', item.id)"
    />
    <slot />
  </label>
</template>

<script>
export default {
  name: "RadioButton",
  props: {
    item: {
      type: Object,
      required: true,
    },
    checkedItem: {
      type: [Number, String],
      required: true,
    },
  },
  computed: {
    radioButtonClasses() {
      const { kind, value } = this.item;
      return kind === "sauce" ? "" : `${kind}__input ${kind}__input--${value}`;
    },
  },
};
</script>

<style lang="scss" scoped></style>
