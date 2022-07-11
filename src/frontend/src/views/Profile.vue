<template>
  <AppLayoutContent>
    <div class="layout__title">
      <h1 class="title title--big">Мои данные</h1>
    </div>
    <ProfileUser v-if="user" />
    <SlideTransitionGroup>
      <ProfileAddressCard
        v-for="address in addresses"
        :key="address.id"
        :address="address"
      />
    </SlideTransitionGroup>
    <transition name="form" mode="out-in">
      <router-view />
    </transition>
    <div class="layout__button">
      <AppButton
        class="button--border"
        @click="toggleForm"
        data-test="button-open"
        >{{ buttonText }}</AppButton
      >
    </div>
  </AppLayoutContent>
</template>

<script>
import { mapState, mapActions } from "vuex";
import AppLayoutContent from "@/layouts/AppLayoutContent";
import ProfileUser from "@/modules/profile/components/ProfileUser";
import ProfileAddressCard from "@/modules/profile/components/ProfileAddressCard";
import { auth } from "@/middlewares";

export default {
  name: "Profile",
  layout: "AppLayoutMain",
  middlewares: [auth],
  components: {
    AppLayoutContent,
    ProfileUser,
    ProfileAddressCard,
  },
  computed: {
    ...mapState("Auth", ["user", "addresses"]),

    isCreateRoute() {
      return this.$route.name === "ProfileCreate";
    },

    buttonText() {
      return this.isCreateRoute ? "Закрыть форму" : "Добавить новый адрес";
    },
  },
  async created() {
    await this.queryAddresses();
  },
  methods: {
    ...mapActions("Auth", ["queryAddresses"]),

    toggleForm() {
      if (this.isCreateRoute) {
        this.$router.push("/profile");
      } else {
        this.$router.push("/profile/create");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.form-enter-active {
  animation: fade-in 0.3s;
}

.form-leave-active {
  animation: fade-in 0.3s reverse;
}
</style>
