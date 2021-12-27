<template>
  <li>
    <img :src="addon.image" width="20" height="30" :alt="addon.name" />
    <p>
      <span>{{ addon.name }}</span>
      <b>{{ addon.count }} х {{ addon.price }} ₽</b>
    </p>
  </li>
</template>

<script>
export default {
  name: "Addon",
  props: {
    addon: {
      type: Object,
      required: true,
    },
  },
};
</script>
