<template>
  <PopupOverlay @keydown.esc.prevent="close">
    <div class="sign-form">
      <router-link to="/" class="close close--white">
        <span class="visually-hidden">Закрыть форму авторизации</span>
      </router-link>
      <div class="sign-form__title">
        <h1 class="title title--small">Авторизуйтесь на сайте</h1>
      </div>
      <LoginForm />
    </div>
  </PopupOverlay>
</template>

<script>
import LoginForm from "@/modules/login/components/LoginForm";

export default {
  name: "Login",
  components: { LoginForm },
  methods: {
    close() {
      this.$router.push("/");
    },
  },
};
</script>
