<template>
  <div>
    <ProfileAddressForm
      is-edit-mode
      :is-deleting="isDeleting"
      :is-submitting="isSubmitting"
      @delete="isConfirmPopupShowed = true"
      @save="submit"
    />
    <PopupTransition>
      <ConfirmPopup
        v-if="isConfirmPopupShowed"
        :is-submitting="isDeleting"
        :address-id="addressId"
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
import { auth } from "@/middlewares";

export default {
  name: "ProfileEdit",
  layout: "AppLayoutMain",
  middlewares: [auth],
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
