<template>
  <AppLayoutDefault>
    <main class="layout">
      <AppLayoutMainSidebar />
      <slot />
    </main>
  </AppLayoutDefault>
</template>

<script>
import AppLayoutDefault from "@/layouts/AppLayoutDefault";
import AppLayoutMainSidebar from "@/layouts/AppLayoutMainSidebar";

export default {
  name: "AppLayoutMain",
  components: {
    AppLayoutDefault,
    AppLayoutMainSidebar,
  },
};
</script>
