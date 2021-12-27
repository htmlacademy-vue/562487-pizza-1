<template>
  <component
    :is="layout"
    :user="user"
    :cartTotalSum="cartTotalSum"
    @logout="$emit('logout')"
    @addNewOrder="$emit('addNewOrder', $event)"
  >
    <slot />
  </component>
</template>

<script>
const defaultLayout = "AppLayoutDefault";

export default {
  name: "AppLayout",
  props: {
    user: {
      type: Object,
      default: null,
    },
    cartTotalSum: {
      type: Number,
      required: true,
    },
  },
  computed: {
    layout() {
      const layout = this.$route.meta.layout || defaultLayout;
      return () => import(`@/layouts/${layout}.vue`);
    },
  },
};
</script>
