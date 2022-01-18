<template>
  <PopupOverlay @click.self="close" @keydown.esc.prevent="close">
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
import { mapState } from "vuex";
import LoginForm from "@/modules/login/components/LoginForm";

export default {
  name: "Login",
  components: { LoginForm },
  computed: {
    ...mapState("Auth", ["user"]),
  },
  created() {
    if (this.user) {
      this.$router.push("/");
    }
  },
  methods: {
    close() {
      this.$router.push("/");
    },
  },
};
</script>
