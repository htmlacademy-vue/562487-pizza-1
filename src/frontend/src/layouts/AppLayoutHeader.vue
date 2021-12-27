<template>
  <header class="header">
    <div class="header__logo">
      <Logo />
    </div>
    <div class="header__cart">
      <router-link to="/cart">{{ cartTotalSum }} ₽</router-link>
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
      <a href="#" class="header__logout" @click.prevent="$emit('logout')"
        ><span>Выйти</span></a
      >
    </div>
  </header>
</template>

<script>
export default {
  name: "AppLayoutHeader",
  props: {
    user: {
      type: Object,
      default: null,
    },
    cartTotalSum: {
      type: Number,
      required: true,
    },
  },
};
</script>
