<template>
  <header class="header">
    <div class="header__logo">
      <a href="index.html" class="logo">
        <img
          src="@/assets/img/logo.svg"
          alt="V!U!E! Pizza logo"
          width="90"
          height="40"
        />
      </a>
    </div>
    <div class="header__cart">
      <a href="cart.html">0 ₽</a>
    </div>
    <div v-if="!user" key="header-with-no-user" class="header__user">
      <a href="#" class="header__login">
        <span>Войти</span>
      </a>
    </div>
    <div v-else key="header-with-user" class="header__user">
      <a href="/user-data">
        <picture>
          <source
            type="image/webp"
            :srcset="`${userAvatar.webp} 1x,
              ${userAvatar.webp2x} 2x`"
          />
          <img
            :src="userAvatar.jpg"
            :srcset="userAvatar.jpg2x"
            :alt="user.name"
            width="32"
            height="32"
          />
        </picture>
        <span>{{ user.name }}</span>
      </a>
      <a href="#" class="header__logout"><span>Выйти</span></a>
    </div>
  </header>
</template>

<script>
import user from "@/static/user.json";
import { generateAvatar } from "@/common/helpers";

export default {
  name: "AppLayoutHeader",
  data() {
    return {
      // not authorized
      user: null,
      // authorized
      // user,
      userAvatar: user && generateAvatar(user.avatar),
    };
  },
};
</script>

<style lang="scss" scoped></style>
