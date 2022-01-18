<template>
  <button :type="type" class="button" v-on="$listeners">
    <slot />
  </button>
</template>

<script>
export default {
  name: "AppButton",
  props: {
    type: {
      type: String,
      default: "button",
    },
  },
};
</script>
