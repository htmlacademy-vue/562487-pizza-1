<template>
  <div>
    <ProfileAddressForm
      isEditMode
      :isDeleting="isDeleting"
      :isSubmitting="isSubmitting"
      @deleteClick="isConfirmPopupShowed = true"
      @submitForm="submit"
    />
    <PopupTransition>
      <ConfirmPopup
        v-if="isConfirmPopupShowed"
        :isSubmitting="isDeleting"
        :addressId="addressId"
        @confirm="confirmDelete"
        @cancel="isConfirmPopupShowed = false"
      >
        <h2 class="title">Удалить адрес #{{ addressId }}?</h2>
        <p>После удаления aдрес не сохранится.</p>
      </ConfirmPopup>
    </PopupTransition>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import ProfileAddressForm from "@/modules/profile/components/ProfileAddressForm";

export default {
  name: "ProfileEdit",
  components: {
    ProfileAddressForm,
  },
  data() {
    return {
      isDeleting: false,
      isSubmitting: false,
      isConfirmPopupShowed: false,
    };
  },
  computed: {
    ...mapState("Auth", ["user"]),

    addressId() {
      return +this.$route.params.id;
    },
  },
  methods: {
    ...mapActions("Auth", ["updateAddress", "deleteAddress"]),

    closeForm() {
      this.$router.push("/profile");
    },

    async confirmDelete() {
      this.isDeleting = true;
      try {
        await this.deleteAddress(this.addressId);
        const message = `Адрес ${this.addressId} успешно удалён`;
        this.$notifier.success(message);
        this.isConfirmPopupShowed = false;
        this.closeForm();
      } catch {
        this.isDeleting = false;
      }
    },

    async submit(address) {
      this.isSubmitting = true;
      try {
        await this.updateAddress({
          ...address,
          userId: this.user.id,
        });
        const message = `Адрес ${this.addressId} успешно обновлён`;
        this.$notifier.success(message);
        this.closeForm();
      } catch {
        this.isSubmitting = false;
      }
    },
  },
};
</script>
