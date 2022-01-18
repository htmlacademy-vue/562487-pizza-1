import Vue from "vue";
import App from "./App.vue";
import "@/plugins/ui";
import "@/plugins/vuePlugins";
import router from "@/router";
import store from "@/store";

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
