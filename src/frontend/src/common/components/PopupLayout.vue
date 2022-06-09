<template>
  <PopupOverlay @click.self="$emit('close')" @keydown.esc="$emit('close')">
    <div class="popup">
      <a href="#" class="close" @click.prevent="$emit('close')" ref="close">
        <span class="visually-hidden">Закрыть попап</span>
      </a>
      <slot />
    </div>
  </PopupOverlay>
</template>

<script>
export default {
  name: "PopupLayout",
  methods: {
    focus() {
      this.$refs.close.focus();
    },
  },
};
</script>
