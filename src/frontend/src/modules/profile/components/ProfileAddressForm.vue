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
            @input="address.name = $event.target.name"
          />
        </div>
        <div class="address-form__input address-form__input--size--normal">
          <AppInput
            label="Улица*"
            name="addr-street"
            placeholder="Введите название улицы"
            @input="address.street = $event.target.value"
          />
        </div>
        <div class="address-form__input address-form__input--size--small">
          <AppInput
            label="Дом*"
            name="addr-house"
            placeholder="Введите номер дома"
            @input="address.house = $event.target.value"
          />
        </div>
        <div class="address-form__input address-form__input--size--small">
          <AppInput
            label="Квартира"
            name="addr-apartment"
            placeholder="Введите № квартиры"
            @input="address.apartment = $event.target.value"
          />
        </div>
        <div class="address-form__input">
          <AppInput
            label="Комментарий"
            name="addr-comment"
            placeholder="Введите комментарий"
            @input="address.comment = $event.target.value"
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
};
</script>
