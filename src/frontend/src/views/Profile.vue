<template>
  <AppLayoutContent>
    <div class="layout__title" ref="start">
      <h1 class="title title--big">Мои данные</h1>
    </div>
    <ProfileUser v-if="user" />
    <SlideTransitionGroup>
      <ProfileAddressCard
        v-for="address in addresses"
        :key="address.id"
        :address="address"
        :isEditDisabled="isFormShowed"
        @edit="editAddress"
      />
    </SlideTransitionGroup>
    <transition
      name="form"
      mode="out-in"
      :css="false"
      @enter="animateFormEnter"
      @leave="animateFormLeave"
    >
      <ProfileAddressForm
        v-if="isFormShowed"
        :isEditMode="isEditMode"
        :addressToEdit="addressToEdit"
        :isDeleting="isDeleting"
        @close="closeForm"
        @deleteAddress="isConfirmPopupShowed = true"
        ref="form"
      />
      <div v-else class="layout__button">
        <AppButton class="button--border" @click="openForm">
          Добавить новый адрес
        </AppButton>
      </div>
    </transition>
    <PopupTransition>
      <ConfirmPopup
        v-if="isConfirmPopupShowed"
        :isSubmitting="isDeleting"
        :addressId="addressToEdit"
        @confirm="confirmDelete"
        @cancel="closeConfirmPopup"
      >
        <h2 class="title">Удалить адрес #{{ addressToEdit }}?</h2>
        <p>После удаления aдрес не сохранится.</p>
      </ConfirmPopup>
    </PopupTransition>
  </AppLayoutContent>
</template>

<script>
import { mapActions, mapState } from "vuex";
import AppLayoutContent from "@/layouts/AppLayoutContent";
import ProfileUser from "@/modules/profile/components/ProfileUser";
import ProfileAddressCard from "@/modules/profile/components/ProfileAddressCard";
import ProfileAddressForm from "@/modules/profile/components/ProfileAddressForm";
import { clearAnimations } from "@/common/helpers";

export default {
  name: "Profile",
  components: {
    AppLayoutContent,
    ProfileUser,
    ProfileAddressCard,
    ProfileAddressForm,
  },
  data() {
    return {
      isEditMode: false,
      isFormShowed: false,
      addressToEdit: null,
      isConfirmPopupShowed: false,
      isDeleting: false,
      addressIdToDelete: null,
      editY: 0,
    };
  },
  computed: {
    ...mapState("Auth", ["user", "addresses"]),
  },
  async created() {
    await this.queryAddresses();
  },
  methods: {
    ...mapActions("Auth", ["queryAddresses", "deleteAddress"]),

    editAddress(addressId) {
      this.addressToEdit = addressId;
      this.openEditForm();
    },
    openForm() {
      this.isFormShowed = true;
      this.isEditMode = false;
    },
    openEditForm() {
      this.isFormShowed = true;
      this.isEditMode = true;
    },
    closeForm() {
      this.isFormShowed = false;
      this.isEditMode = false;
      this.addressToEdit = null;
    },
    closeConfirmPopup() {
      this.isConfirmPopupShowed = false;
    },
    async confirmDelete() {
      this.isDeleting = true;
      if (this.isEditMode) {
        const addressId = this.addressToEdit;
        try {
          await this.deleteAddress(addressId);
          const message = `Адрес ${addressId} успешно удалён`;
          this.$notifier.success(message);
          this.closeConfirmPopup();
          this.closeForm();
          this.isDeleting = false;
        } catch {
          this.isDeleting = false;
        }
      } else {
        this.closeConfirmPopup();
        this.closeForm();
      }
    },
    animateFormEnter(el, done) {
      if (this.isFormShowed) {
        this.$refs.form.$el.scrollIntoView({ block: "center" });
      }
      clearAnimations(el, done);
      el.style.animation = "fade-in 0.3s";
    },
    animateFormLeave(el, done) {
      clearAnimations(el, done);
      el.style.animation = "fade-in 0.3s reverse";
      if (!this.isFormShowed) {
        this.$refs.start.scrollIntoView({ block: "center" });
      }
    },
  },
};
</script>
