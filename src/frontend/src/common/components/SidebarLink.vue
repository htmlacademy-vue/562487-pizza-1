<template>
  <router-link
    class="layout__link"
    active-class="layout__link--active"
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
};
</script>
