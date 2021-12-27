<template>
  <div class="content__diameter">
    <div class="sheet">
      <h2 class="title title--small sheet__title">Выберите размер</h2>

      <div class="sheet__content diameter">
        <RadioButton
          v-for="size in sizes"
          :key="size.id"
          :item="size"
          :checkedItem="checkedSize"
          @change="$emit('sizeChange', $event)"
        >
          <span>{{ size.name }}</span>
        </RadioButton>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "BuilderSizeSelector",
  props: {
    sizes: {
      type: Array,
      required: true,
    },
    checkedSize: {
      type: [Number, String],
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped></style>
