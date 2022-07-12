<template>
  <div id="app">
    <AppLayout>
      <router-view />
    </AppLayout>
  </div>
</template>

<script>
import { setAuth } from "@/common/helpers";

export default {
  name: "App",
  async created() {
    window.onerror = function (msg, url, line, col, error) {
      console.error(error);
    };
    if (this.$jwt.getToken()) {
      setAuth(this.$store);
    }
    await this.$store.dispatch("init");
  },
};
</script>

<style lang="scss">
@import "~@/assets/scss/app";

@keyframes slide {
  0% {
    transform: translateX(10%);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slide-leave {
  100% {
    transform: translateX(-10%);
    opacity: 0;
  }
}

@keyframes sidebar-slide {
  0% {
    opacity: 0;
    transform: translateX(-25px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes sidebar-leave {
  100% {
    opacity: 0;
    transform: translateX(-25px);
  }
}

@keyframes zoom-in {
  0% {
    transform: translate(-50%, -50%) scale(0.3);
    opacity: 0;
  }
  50% {
    transform: translate(-50%, -50%);
  }
  100% {
    opacity: 1;
  }
}

@keyframes fade-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 100%;
  }
}

@keyframes slide-up {
  0% {
    transform: translate(-50%, -50%) translateY(-10%);
    opacity: 0;
  }
  100% {
    transform: translate(-50%, -50%) translateY(0);
    opacity: 1;
  }
}

@keyframes roll-in {
  0% {
    transform: scale(0) rotateZ(0deg) translateX(-250px);
    opacity: 0;
  }
  100% {
    transform: scale(1) rotateZ(360deg) translateX(0px);
    opacity: 1;
  }
}
</style>
