<template>
  <PopupOverlay @click.self="closeLogin" @keydown.esc="closeLogin">
    <div class="sign-form" ref="login">
      <router-link to="/" class="close close--white">
        <span class="visually-hidden">Закрыть форму авторизации</span>
      </router-link>
      <div class="sign-form__title">
        <h1 class="title title--small">Авторизуйтесь на сайте</h1>
      </div>
      <LoginForm @close="closeLogin" />
    </div>
  </PopupOverlay>
</template>

<script>
import LoginForm from "@/modules/login/components/LoginForm";

export default {
  name: "Login",
  components: { LoginForm },
  methods: {
    closeLogin() {
      this.$router.push("/");
    },
  },
};
</script>
