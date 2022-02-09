<template>
  <main class="content">
    <Builder :isEditMode="isEditMode" @saveEdit="isEditMode = false" />
    <BuilderPopup
      v-if="isPopupShowed"
      @cancel="leavePage"
      @close="isPopupShowed = false"
    />
    <router-view />
  </main>
</template>

<script>
import { mapState, mapGetters, mapMutations } from "vuex";
import Builder from "@/modules/builder/components/Builder";
import BuilderPopup from "@/modules/builder/components/BuilderPopup";
import {
  SET_BUILDER_ENTITY,
  RESET_BUILDER_PIZZA,
} from "@/store/mutations-types";

export default {
  name: "IndexHome",
  components: {
    Builder,
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
  },
  created() {
    const pizzaId = this.$route.params.id;
    if (!pizzaId) {
      return;
    } else {
      const pizzaToEdit = this.orderPizzaById(pizzaId);
      if (pizzaToEdit) {
        this.isEditMode = true;
        this.setBuilderEntity({ entity: "pizza", value: pizzaToEdit });
      } else {
        this.$route.push("/");
      }
    }
  },
  methods: {
    ...mapMutations("Builder", {
      setBuilderEntity: SET_BUILDER_ENTITY,
      resetPizza: RESET_BUILDER_PIZZA,
    }),

    leavePage() {
      this.isEditMode = false;
      this.resetPizza();
      this.$router.push(this.routeToLeave);
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
