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
import { mapState, mapMutations } from "vuex";
import Builder from "@/modules/builder/components/Builder";
import BuilderPopup from "@/modules/builder/components/BuilderPopup";
import { SET_PIZZA, RESET_PIZZA } from "@/store/mutations-types";

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
    ...mapState("Cart", ["pizzas"]),
  },
  created() {
    const pizzaId = this.$route.params.id;
    if (!pizzaId) {
      return;
    } else {
      const pizzaToEdit = this.pizzas.find((pizza) => {
        return pizza.id === pizzaId;
      });
      if (pizzaToEdit) {
        this.isEditMode = true;
        this.setPizza(pizzaToEdit);
      } else {
        this.$route.push("/");
      }
    }
  },
  methods: {
    ...mapMutations("Builder", {
      setPizza: SET_PIZZA,
      resetPizza: RESET_PIZZA,
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
