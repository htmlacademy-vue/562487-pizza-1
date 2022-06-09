<template>
  <main class="layout">
    <AppLayoutMainSidebar />
    <transition name="content" mode="out-in" appear>
      <slot />
    </transition>
  </main>
</template>

<script>
import AppLayoutMainSidebar from "@/layouts/AppLayoutMainSidebar";

export default {
  name: "AppLayoutMain",
  components: { AppLayoutMainSidebar },
};
</script>

<style lang="scss" scoped>
.content-enter-active {
  animation: slide 0.5s;
}

.content-leave-active {
  animation: slide 0.5s reverse;
}
</style>
