<template>
  <router-link
    :to="link.to"
    class="layout__link"
    active-class="layout__link--active"
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
