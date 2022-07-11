<template>
  <ProfileAddressForm
    :isSubmitting="isSubmitting"
    @deleteClick="closeForm"
    @submitForm="submit"
  />
</template>

<script>
import { mapState, mapActions } from "vuex";
import ProfileAddressForm from "@/modules/profile/components/ProfileAddressForm";
import { auth } from "@/middlewares";

export default {
  name: "ProfileCreate",
  layout: "AppLayoutMain",
  middlewares: [auth],
  components: {
    ProfileAddressForm,
  },
  data() {
    return {
      isSubmitting: false,
    };
  },
  computed: {
    ...mapState("Auth", ["user"]),
  },
  methods: {
    ...mapActions("Auth", ["createNewAddress"]),

    closeForm() {
      this.$router.push("/profile");
    },

    async submit(address) {
      this.isSubmitting = true;
      try {
        const addressData = address.toRaw();
        const data = await this.createNewAddress({
          ...addressData,
          userId: this.user.id,
        });
        const message = `Адрес ${data.id} успешно создан`;
        this.$notifier.success(message);
        this.closeForm();
      } catch {
        this.isSubmitting = false;
      }
    },
  },
};
</script>
