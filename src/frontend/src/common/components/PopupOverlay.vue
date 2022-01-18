<template>
  <div class="overlay" v-on="$listeners">
    <slot />
  </div>
</template>

<script>
export default {
  name: "PopupOverlay",
};
</script>

<style lang="scss" scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 2;
}
</style>
