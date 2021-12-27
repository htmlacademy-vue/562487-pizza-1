<template>
  <div class="overlay">
    <div class="sign-form">
      <router-link to="/" class="close close--white">
        <span class="visually-hidden">Закрыть форму авторизации</span>
      </router-link>
      <div class="sign-form__title">
        <h1 class="title title--small">Авторизуйтесь на сайте</h1>
      </div>
      <form action="#" method="post" @submit.prevent="$emit('login')">
        <div class="sign-form__input">
          <label class="input">
            <span>E-mail</span>
            <input
              type="email"
              name="email"
              placeholder="example@mail.ru"
              @input="email = $event.target.value"
            />
          </label>
        </div>

        <div class="sign-form__input">
          <label class="input">
            <span>Пароль</span>
            <input
              type="password"
              name="pass"
              placeholder="***********"
              @input="password = $event.target.value"
            />
          </label>
        </div>
        <button type="submit" class="button">Авторизоваться</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      email: "",
      password: "",
    };
  },
};
</script>

<style lang="scss" scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 2;
}
</style>
