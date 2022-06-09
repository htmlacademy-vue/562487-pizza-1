<template>
  <div class="layout__address">
    <form
      action="/"
      method="post"
      class="address-form address-form--opened sheet"
      @submit.prevent="submit"
    >
      <div class="address-form__header">
        <b>{{ addressFormTitle }}</b>
      </div>

      <div class="address-form__wrapper">
        <div class="address-form__input">
          <AppInput
            label="Название адреса*"
            name="addr-name"
            placeholder="Введите название адреса"
            v-model="address.name"
            ref="name"
          />
        </div>
        <div class="address-form__input address-form__input--size--normal">
          <AppInput
            label="Улица*"
            name="addr-street"
            placeholder="Введите название улицы"
            v-model="address.street"
            ref="street"
          />
        </div>
        <div class="address-form__input address-form__input--size--small">
          <AppInput
            label="Дом*"
            name="addr-house"
            placeholder="Введите номер дома"
            v-model="address.building"
            ref="building"
          />
        </div>
        <div class="address-form__input address-form__input--size--small">
          <AppInput
            label="Квартира"
            name="addr-apartment"
            placeholder="Введите № квартиры"
            v-model="address.flat"
          />
        </div>
        <div class="address-form__input">
          <AppInput
            label="Комментарий"
            name="addr-comment"
            placeholder="Введите комментарий"
            v-model="address.comment"
          />
        </div>
      </div>

      <div class="address-form__buttons">
        <AppButton
          v-if="!isSubmitting"
          class="button--transparent"
          :disabled="isDeleting || isSubmitting"
          @click="startDeleteAddress"
        >
          Удалить
        </AppButton>
        <AppButton type="submit" :disabled="isSubmitDisabled || isDeleting"
          >Сохранить</AppButton
        >
      </div>
    </form>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import { Address } from "@/common/models";

export default {
  name: "ProfileAddressForm",
  props: {
    isEditMode: {
      type: Boolean,
      required: true,
    },
    addressToEdit: {
      type: Number,
      default: null,
    },
    isDeleting: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      address: null,
      isSubmitting: false,
    };
  },
  computed: {
    ...mapState("Auth", ["user"]),
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
      return this.addressToEdit ? "Редактировать адрес" : "Новый адрес";
    },
  },
  created() {
    if (this.addressToEdit) {
      this.address = this.addressById(this.addressToEdit);
    } else {
      this.address = Address.createNew();
    }
  },
  mounted() {
    this.$refs.name.focus();
  },
  methods: {
    ...mapActions("Auth", ["createNewAddress", "updateAddress"]),

    startDeleteAddress() {
      if (this.isEditMode) {
        this.$emit("deleteAddress");
      } else {
        this.$emit("close");
      }
    },

    async create() {
      this.isSubmitting = true;
      try {
        const addressData = this.address.toRaw();
        const data = await this.createNewAddress({
          ...addressData,
          userId: this.user.id,
        });
        const message = `Адрес ${data.id} успешно создан`;
        this.$notifier.success(message);
        this.$emit("close");
      } catch (err) {
        console.log(err);
        this.isSubmitting = false;
      }
    },

    async update() {
      this.isSubmitting = true;
      try {
        await this.updateAddress({
          ...this.address,
          userId: this.user.id,
        });
        const message = `Адрес ${this.addressToEdit} успешно обновлён`;
        this.$notifier.success(message);
        this.$emit("close");
      } catch {
        this.isSubmitting = false;
      }
    },

    async submit() {
      if (this.addressToEdit) {
        await this.update();
      } else {
        await this.create();
      }
    },
  },
};
</script>
