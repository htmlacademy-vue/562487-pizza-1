<template>
  <form action="#" method="post" @submit.prevent="submit">
    <div class="sign-form__input">
      <AppInput
        name="email"
        label="E-mail"
        placeholder="example@mail.ru"
        :value="email"
        @input="email = $event.target.value"
        :error="validations.email.error"
        ref="email"
      />
    </div>

    <div class="sign-form__input">
      <AppInput
        type="password"
        name="password"
        label="Пароль"
        placeholder="***********"
        :value="password"
        @input="password = $event.target.value"
        :error="validations.password.error"
        ref="password"
      />
    </div>
    <AppButton type="submit">Авторизоваться</AppButton>
  </form>
</template>

<script>
import { mapActions } from "vuex";
import validator from "@/common/mixins/validator";

export default {
  name: "LoginForm",
  mixins: [validator],
  data() {
    return {
      email: "",
      password: "",
      validations: {
        email: {
          error: "",
          rules: ["required", "email"],
        },
        password: {
          error: "",
          rules: ["required"],
        },
      },
      isFormValid: true,
    };
  },
  watch: {
    email: function (value) {
      if (!this.isFormValid) {
        this.$validateField({ name: "email", value }, this.validations);
        return;
      }
      if (this.validations.email.error) {
        this.$clearValidationError("email");
      }
    },
    password: function (value) {
      if (!this.isFormValid) {
        this.$validateField({ name: "password", value }, this.validations);
        return;
      }
      if (this.validations.password.error) {
        this.$clearValidationError("password");
      }
    },
  },
  mounted() {
    this.$refs.email.focus();
  },
  methods: {
    ...mapActions("Auth", { login: "login" }),

    async submit() {
      const appUser = {
        email: this.email,
        password: this.password,
      };
      if (!this.$validateFields(appUser, this.validations)) {
        this.isFormValid = false;
        return;
      }
      try {
        await this.login(appUser);
        this.$router.push("/");
      } catch (err) {
        this.$notifier.error("Failed to login: " + err.message);
      }
    },
  },
};
</script>
