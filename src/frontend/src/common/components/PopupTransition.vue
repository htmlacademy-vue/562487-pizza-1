<template>
  <transition
    name="popup"
    appear
    @enter="animatePopupEnter"
    @leave="animatePopupLeave"
  >
    <slot />
  </transition>
</template>

<script>
import { clearAnimations } from "@/common/helpers";
import { Animations } from "@/common/constants";

export default {
  name: "PopupTransition",
  props: {
    hasCallback: {
      type: Boolean,
      default: false,
    },
  },

  methods: {
    animatePopupEnter(el, done) {
      const firstChildEl = el.firstElementChild;
      clearAnimations(firstChildEl, done);
      firstChildEl.style.animation = Animations.ZOOM;
    },

    animatePopupLeave(el, done) {
      const firstChildEl = el.firstElementChild;
      clearAnimations(firstChildEl, () => {
        done();
        if (this.hasCallback) {
          this.$emit("leave");
        }
      });
      firstChildEl.style.animation = Animations.ZOOM_REVERSE;
    },
  },
};
</script>

<style lang="scss" scoped>
.popup-enter-active {
  animation: fade-in 0.1s;
}

.popup-leave-active {
  animation: fade-in 0.5s reverse;
}
</style>
