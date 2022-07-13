<template>
  <form
    action="#"
    method="post"
    @submit.prevent="submit"
  >
    <div class="sign-form__input">
      <AppInput
        ref="email"
        v-model="userData.email"
        name="email"
        label="E-mail"
        placeholder="example@mail.ru"
        :error="validations.email.error"
        data-test="login-email"
      />
    </div>

    <div class="sign-form__input">
      <AppInput
        v-model="userData.password"
        type="password"
        name="password"
        label="Пароль"
        placeholder="***********"
        :error="validations.password.error"
        data-test="login-password"
      />
    </div>
    <AppButton
      type="submit"
      :disabled="isSubmitting"
    >Авторизоваться</AppButton>
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
      userData: {
        email: "",
        password: "",
      },

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
      isSubmitting: false,
    };
  },

  watch: {
    "userData.email": function (value) {
      if (!this.isFormValid) {
        this.$validateField({ name: "email", value }, this.validations);
        return;
      }
      if (this.validations.email.error) {
        this.$clearValidationError("email");
      }
    },

    "userData.password": function (value) {
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
      this.isSubmitting = true;
      if (!this.$validateFields(this.userData, this.validations)) {
        this.isFormValid = false;
        this.isSubmitting = false;
        return;
      }
      try {
        await this.login(this.userData);
        this.$emit("close");
      } catch {
        this.isFormValid = false;
        this.isSubmitting = false;
      }
    },
  },
};
</script>
