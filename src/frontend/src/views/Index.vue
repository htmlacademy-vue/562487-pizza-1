<template>
  <main class="content">
    <BuilderForm :isEditMode="isEditMode" @saveEdit="isEditMode = false" />
    <PopupTransition>
      <BuilderPopup
        v-if="isPopupShowed"
        key="builder"
        @save="savePizza"
        @cancel="leavePage"
        @close="isPopupShowed = false"
      />
    </PopupTransition>
    <PopupTransition>
      <router-view />
    </PopupTransition>
  </main>
</template>

<script>
import { mapState, mapGetters, mapMutations } from "vuex";
import BuilderForm from "@/modules/builder/components/BuilderForm";
import BuilderPopup from "@/modules/builder/components/BuilderPopup";
import {
  SET_BUILDER_ENTITY,
  RESET_BUILDER_PIZZA,
  UPDATE_PIZZA,
} from "@/store/mutations-types";

export default {
  name: "IndexHome",
  components: {
    BuilderForm,
    BuilderPopup,
  },
  data() {
    return {
      isEditMode: false,
      isPopupShowed: false,
      routeToLeave: null,
    };
  },
  computed: {
    ...mapGetters("Cart", ["orderPizzaById"]),
    ...mapState("Cart", ["order"]),
    ...mapState("Builder", ["pizza"]),
  },
  created() {
    const pizzaId = this.$route.params.id;
    if (!pizzaId) {
      return;
    }
    const pizzaToEdit = this.orderPizzaById(pizzaId);
    if (!pizzaToEdit) {
      this.$router.push("/");
      return;
    }
    this.isEditMode = true;
    this.setBuilderEntity({ entity: "pizza", value: pizzaToEdit });
  },
  methods: {
    ...mapMutations("Builder", {
      setBuilderEntity: SET_BUILDER_ENTITY,
      resetPizza: RESET_BUILDER_PIZZA,
    }),
    ...mapMutations("Cart", {
      updatePizza: UPDATE_PIZZA,
    }),

    savePizza() {
      this.updatePizza(this.pizza);
      this.pushNextRoute();
    },

    leavePage() {
      this.resetPizza();
      this.pushNextRoute();
    },

    pushNextRoute() {
      this.isPopupShowed = false;
      this.isEditMode = false;
      setTimeout(() => {
        this.$router.push(this.routeToLeave);
      }, 500);
    },
  },
  beforeRouteUpdate(to, from, next) {
    if (this.isEditMode) {
      this.isPopupShowed = true;
      this.routeToLeave = to.path;
      return;
    }
    next();
  },
  beforeRouteLeave(to, from, next) {
    if (this.isEditMode) {
      this.isPopupShowed = true;
      this.routeToLeave = to.path;
      return;
    }
    next();
  },
};
</script>
