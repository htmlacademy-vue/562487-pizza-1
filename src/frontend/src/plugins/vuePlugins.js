import Vue from "vue";
import Notifier from "@/plugins/notifier";
import store from "@/store";
import JwtService from "../services/jwt.service";
import { createResources } from "../common/helpers";

const plugins = {
  install(Vue) {
    Vue.mixin({
      computed: {
        $notifier: () => new Notifier(store),
        $jwt: () => JwtService,
        $api: () => createResources(this.$notifier),
      },
    });
  },
};

Vue.use(plugins);
