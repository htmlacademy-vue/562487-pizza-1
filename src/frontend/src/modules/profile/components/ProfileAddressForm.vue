<template>
  <div class="layout__address">
    <form
      action="/"
      method="post"
      class="address-form address-form--opened sheet"
    >
      <div class="address-form__header">
        <b>Новый адрес</b>
      </div>

      <div class="address-form__wrapper">
        <div class="address-form__input">
          <AppInput
            label="Название адреса*"
            name="addr-name"
            placeholder="Введите название адреса"
            v-model="name"
          />
        </div>
        <div class="address-form__input address-form__input--size--normal">
          <AppInput
            label="Улица*"
            name="addr-street"
            placeholder="Введите название улицы"
            v-model="street"
          />
        </div>
        <div class="address-form__input address-form__input--size--small">
          <AppInput
            label="Дом*"
            name="addr-house"
            placeholder="Введите номер дома"
            v-model="building"
          />
        </div>
        <div class="address-form__input address-form__input--size--small">
          <AppInput
            label="Квартира"
            name="addr-apartment"
            placeholder="Введите № квартиры"
            v-model="flat"
          />
        </div>
        <div class="address-form__input">
          <AppInput
            label="Комментарий"
            name="addr-comment"
            placeholder="Введите комментарий"
            v-model="comment"
          />
        </div>
      </div>

      <div class="address-form__buttons">
        <AppButton
          class="button--transparent"
          @click="$emit('closeForm', $event)"
        >
          Удалить
        </AppButton>
        <AppButton>Сохранить</AppButton>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: "ProfileAddressForm",
  data() {
    return {
      name: "",
      street: "",
      building: "",
      flat: "",
      comment: "",
    };
  },
};
</script>
