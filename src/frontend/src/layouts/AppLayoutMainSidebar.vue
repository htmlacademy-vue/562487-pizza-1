<template>
  <div class="layout__sidebar sidebar">
    <Logo class="layout__logo" />
    <SidebarLink v-for="link in links" :key="link.pathName" :link="link" />
  </div>
</template>

<script>
import SidebarLink from "@/common/components/SidebarLink.vue";

export default {
  name: "AppLayoutMainSidebar",
  components: { SidebarLink },
  data() {
    return {
      links: [
        {
          to: "/orders",
          pathName: "Orders",
          title: "История заказов",
        },
        {
          to: "/profile",
          pathName: "Profile",
          title: "Мои данные",
        },
      ],
    };
  },
};
</script>
