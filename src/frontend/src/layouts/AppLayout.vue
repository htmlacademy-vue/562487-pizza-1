<template>
  <AppLayoutDefault>
    <transition
      name="layout"
      :css="false"
      mode="out-in"
      appear
      @enter="animateEnter"
      @leave="animateLeave"
    >
      <AppLayoutMain v-if="isMainLayout">
        <slot />
      </AppLayoutMain>
      <slot v-else />
    </transition>
  </AppLayoutDefault>
</template>

<script>
import AppLayoutDefault from "@/layouts/AppLayoutDefault";
import AppLayoutMain from "@/layouts/AppLayoutMain";
import { clearAnimations } from "@/common/helpers";
import { Animations } from "@/common/constants";

export default {
  name: "AppLayout",
  components: { AppLayoutDefault, AppLayoutMain },
  data() {
    return {
      isFromMainLayout: false,
    };
  },

  computed: {
    isMainLayout() {
      return this.$route.meta.layout === "AppLayoutMain";
    },
  },

  watch: {
    $route(to, from) {
      this.isFromMainLayout = from.meta.layout === "AppLayoutMain";
    },
  },

  methods: {
    animateEnter(el, done) {
      if (this.isMainLayout) {
        const sidebarEl = el.firstElementChild;
        clearAnimations(sidebarEl, done);
        sidebarEl.style.animation = Animations.SIDEBAR;
        return;
      }
      clearAnimations(el, done);
      el.style.animation = Animations.SLIDE;
    },

    animateLeave(el, done) {
      if (this.isFromMainLayout) {
        const sidebarEl = el.firstElementChild;
        clearAnimations(sidebarEl, done);
        sidebarEl.style.animation = Animations.SIDEBAR_REVERSE;
        return;
      }
      clearAnimations(el, done);
      el.style.animation = Animations.SLIDE_LEAVE;
    },
  },
};
</script>
