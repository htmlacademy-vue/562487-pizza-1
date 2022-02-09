<template>
  <div class="layout__address">
    <form
      action="/"
      method="post"
      class="address-form address-form--opened sheet"
      @submit.prevent="submit"
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
          @click="toggleConfirmPopup"
        >
          Удалить
        </AppButton>
        <AppButton type="submit" :disabled="isSubmitDisabled || isDeleting"
          >Сохранить</AppButton
        >
      </div>
    </form>
    <ConfirmPopup
      v-if="isConfirmPopupShowed"
      :isSubmitting="isSubmitting"
      @confirm="confirmDelete"
      @cancel="toggleConfirmPopup"
    >
      <h2 class="title">Удалить адрес #{{ address.id }}?</h2>
      <p>После удаления aдрес не сохранится.</p>
    </ConfirmPopup>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { Address } from "@/common/models";

export default {
  name: "ProfileAddressForm",
  props: {
    addressToEdit: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      address: null,
      isDeleting: false,
      isSubmitting: false,
      isConfirmPopupShowed: false,
    };
  },
  computed: {
    ...mapState("Auth", ["user"]),
    isSubmitDisabled() {
      return (
        !this.address.name ||
        !this.address.street ||
        !this.address.building ||
        this.isSubmitting
      );
    },
  },
  created() {
    if (this.addressToEdit) {
      this.address = Object.assign({}, this.addressToEdit);
    } else {
      this.address = Address.createNew();
    }
  },
  mounted() {
    this.$refs.name.focus();
  },
  methods: {
    ...mapActions("Auth", [
      "createNewAddress",
      "updateAddress",
      "deleteAddress",
    ]),

    toggleConfirmPopup() {
      this.isConfirmPopupShowed = !this.isConfirmPopupShowed;
    },

    async confirmDelete() {
      this.isDeleting = true;
      if (this.addressToEdit) {
        const id = this.addressToEdit.id;
        try {
          await this.deleteAddress(id);
          const message = `Адрес ${id} успешно удалён`;
          this.$notifier.success(message);
          this.$emit("close");
        } catch {
          this.isDeleting = false;
        }
      } else {
        this.$emit("close");
      }
    },

    async create() {
      this.isSubmitting = true;
      try {
        const data = await this.createNewAddress({
          ...this.address.toRaw(),
          userId: this.user.id,
        });
        const message = `Адрес ${data.id} успешно создан`;
        this.$notifier.success(message);
        this.$emit("close");
      } catch {
        this.isSubmitting = false;
      }
    },

    async update() {
      this.isSubmitting = true;
      const { id } = this.addressToEdit;
      try {
        await this.updateAddress({
          ...this.address,
          userId: this.user.id,
          id,
        });
        const message = `Адрес ${id} успешно обновлён`;
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
