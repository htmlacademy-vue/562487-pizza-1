<template>
  <div class="app-layout">
    <AppLayoutHeader
      :user="user"
      :cartTotalSum="cartTotalSum"
      @logout="$emit('logout')"
    />
    <slot />
  </div>
</template>

<script>
import AppLayoutHeader from "@/layouts/AppLayoutHeader";

export default {
  name: "AppLayoutDefault",
  components: {
    AppLayoutHeader,
  },
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
};
</script>

<style>
.app-layout {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  min-width: 960px;
  min-height: 100vh;
}
</style>
