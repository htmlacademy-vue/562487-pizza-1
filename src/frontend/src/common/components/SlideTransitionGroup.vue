<template>
  <transition-group
    name="list"
    appear
  >
    <slot />
  </transition-group>
</template>

<script>
export default {
  name: "SlideTransitionGroup",
};
</script>

<style lang="scss" scoped>
.list-enter-active {
  animation: slide 0.5s;
}

.list-leave-active {
  animation: slide 0.5s reverse;
}
</style>
