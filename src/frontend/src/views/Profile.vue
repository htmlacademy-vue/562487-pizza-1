<template>
  <div v-if="user" class="layout__content">
    <div class="layout__title">
      <h1 class="title title--big">Мои данные</h1>
    </div>

    <ProfileUser :user="user" />
    <ProfileAddressCard
      v-for="address in addresses"
      :key="address.id"
      :address="address"
    />
    <ProfileAddressForm v-if="isFormShowed" @closeForm="isFormShowed = false" />

    <div v-if="!isFormShowed" class="layout__button">
      <AppButton class="button--border" @click="isFormShowed = true">
        Добавить новый адрес
      </AppButton>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import ProfileUser from "@/modules/profile/components/ProfileUser";
import ProfileAddressCard from "@/modules/profile/components/ProfileAddressCard";
import ProfileAddressForm from "@/modules/profile/components/ProfileAddressForm";

export default {
  name: "Profile",
  components: {
    ProfileUser,
    ProfileAddressCard,
    ProfileAddressForm,
  },
  data() {
    return {
      isFormShowed: false,
    };
  },
  computed: {
    ...mapState("Auth", ["user", "addresses"]),
  },
};
</script>
