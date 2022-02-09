<template>
  <div v-if="notifications.length" class="notification__wrapper">
    <div
      v-for="{ id, text, type } in notifications"
      :key="id"
      :class="`notification notification--${type}`"
    >
      <span>{{ text }}</span>
      <a
        href="#"
        class="close close--white close--sm"
        @click.prevent="close(id)"
      >
        <span class="visually-hidden">Закрыть</span>
      </a>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "AppNotifications",
  computed: {
    ...mapState(["notifications"]),
  },
  methods: {
    close(id) {
      this.$notifier.close(id);
    },
  },
};
</script>

<style lang="scss" scoped>
.notification {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  max-width: 100%;
  padding: 20px;
  text-align: center;
  color: $white;
  border-bottom: 2px solid transparent;
  border-radius: 8px;
  &__wrapper {
    position: fixed;
    z-index: 9999;
    top: 57px;
    right: 4%;
    width: 373px;
    padding: 10px;
  }
  &--info {
    border-color: $blue-600;
    background: $blue-500;
  }
  &--error {
    border-color: $red-600;
    background: $red-500;
  }
  &--success {
    border-color: $green-600;
    background: $green-500;
  }
  &--warning {
    border-color: $orange-200;
    background: $orange-100;
  }
}
</style>
