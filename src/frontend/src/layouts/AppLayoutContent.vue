<template>
  <div class="layout__content">
    <slot />
  </div>
</template>

<script>
export default {
  name: "AppLayoutContent",
};
</script>

<style lang="scss" scoped>
.layout__content {
  padding-top: 82px;
  padding-bottom: 100px;
  scroll-behavior: smooth;
}
</style>
