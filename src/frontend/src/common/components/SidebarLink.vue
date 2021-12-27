<template>
  <router-link
    class="layout__link"
    :class="isActive && 'layout__link--active'"
    :to="link.to"
    >{{ link.title }}</router-link
  >
</template>

<script>
export default {
  name: "SidebarLink",
  props: {
    link: {
      type: Object,
      required: true,
    },
  },
  computed: {
    isActive() {
      return this.$route.name === this.link.pathName;
    },
  },
};
</script>
