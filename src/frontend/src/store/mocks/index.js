import { cloneDeep } from "lodash";

import Vuex from "vuex";
import { mutations } from "@/store";
import modules from "@/store/modules";
import VuexPlugins from "@/plugins/vuexPlugins";

const initState = () => ({
  notifications: [],
});

export const generateMockStore = (data) => {
  const modulesCopy = cloneDeep(modules);
  if (data?.mutations) {
    Object.entries(data.mutations).forEach(([module, mutations]) => {
      modulesCopy[module] = {
        ...modulesCopy[module],
        mutations: { ...modulesCopy[module].mutations, ...mutations },
      };
    });
  }
  if (data?.actions) {
    Object.entries(data.actions).forEach(([module, actions]) => {
      modulesCopy[module] = { ...modulesCopy[module], actions };
    });
  }

  return new Vuex.Store({
    state: initState(),
    mutations,
    modules: modulesCopy,
    plugins: [VuexPlugins],
  });
};
