<template>
  <div class="layout__address">
    <form
      action="/"
      method="post"
      class="address-form address-form--opened sheet"
      @submit.prevent="$emit('save', address)"
    >
      <div
        class="address-form__header"
        data-test="form-title"
      >
        <b>{{ addressFormTitle }}</b>
      </div>

      <div class="address-form__wrapper">
        <div class="address-form__input">
          <AppInput
            ref="name"
            v-model="address.name"
            label="Название адреса*"
            name="addr-name"
            placeholder="Введите название адреса"
            data-test="address-name"
          />
        </div>
        <div class="address-form__input address-form__input--size--normal">
          <AppInput
            v-model="address.street"
            label="Улица*"
            name="addr-street"
            placeholder="Введите название улицы"
            data-test="address-street"
          />
        </div>
        <div class="address-form__input address-form__input--size--small">
          <AppInput
            v-model="address.building"
            label="Дом*"
            name="addr-house"
            placeholder="Введите номер дома"
            data-test="address-building"
          />
        </div>
        <div class="address-form__input address-form__input--size--small">
          <AppInput
            v-model="address.flat"
            label="Квартира"
            name="addr-apartment"
            placeholder="Введите № квартиры"
            data-test="address-flat"
          />
        </div>
        <div class="address-form__input">
          <AppInput
            v-model="address.comment"
            label="Комментарий"
            name="addr-comment"
            placeholder="Введите комментарий"
            data-test="address-comment"
          />
        </div>
      </div>

      <div class="address-form__buttons">
        <AppButton
          v-if="!isSubmitting"
          :disabled="isDeleting"
          class="button--transparent"
          data-test="btn-delete"
          @click="$emit('delete')"
        >
          Удалить
        </AppButton>
        <AppButton
          type="submit"
          :disabled="isSubmitDisabled || isDeleting"
          >
            Сохранить
          </AppButton>
      </div>
    </form>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { Address } from "@/common/models";

export default {
  name: "ProfileAddressForm",
  props: {
    isEditMode: {
      type: Boolean,
      default: false,
    },

    isDeleting: {
      type: Boolean,
      default: false,
    },

    isSubmitting: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      address: null,
    };
  },

  computed: {
    ...mapGetters("Auth", ["addressById"]),

    isSubmitDisabled() {
      return (
        !this.address.name ||
        !this.address.street ||
        !this.address.building ||
        this.isSubmitting
      );
    },

    addressFormTitle() {
      return this.isEditMode ? "Редактировать адрес" : "Новый адрес";
    },
  },

  created() {
    if (this.isEditMode) {
      const id = +this.$route.params.id;
      this.address = new Address(this.addressById(id));
    } else {
      this.address = Address.createNew();
    }
  },

  mounted() {
    this.$refs.name.focus();
  },
};
</script>
