<template>
  <header class="header">
    <div class="header__logo">
      <Logo />
    </div>
    <div class="header__cart">
      <router-link to="/cart">{{ totalSum }} ₽</router-link>
    </div>

    <div v-if="!user" key="header-with-no-user" class="header__user">
      <router-link to="/login" class="header__login">
        <span>Войти</span>
      </router-link>
    </div>

    <div v-else key="header-with-user" class="header__user">
      <router-link to="/profile">
        <UserPicture :user="user" width="32" height="32" />
        <span>{{ user.name }}</span>
      </router-link>
      <a href="#" class="header__logout" @click.prevent="handleLogout"
        ><span>Выйти</span></a
      >
    </div>
  </header>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";

export default {
  name: "AppLayoutHeader",
  computed: {
    ...mapState("Auth", ["user"]),
    ...mapGetters("Cart", ["totalSum"]),
  },
  methods: {
    ...mapActions("Auth", ["logout"]),
    async handleLogout() {
      await this.logout();
      this.$router.push("/login");
    },
  },
};
</script>
