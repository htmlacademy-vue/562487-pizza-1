<template>
  <div class="layout__content">
    <div class="layout__title">
      <h1 class="title title--big">Мои данные</h1>
    </div>

    <ProfileUser :user="user" />
    <ProfileAddressCard
      v-for="address in addresses"
      :key="address.id"
      :address="address"
    />
    <ProfileAddressForm
      v-if="isFormShowed"
      @closeForm="isFormShowed = !isFormShowed"
    />

    <div v-if="!isFormShowed" class="layout__button">
      <button
        type="button"
        class="button button--border"
        @click="isFormShowed = !isFormShowed"
      >
        Добавить новый адрес
      </button>
    </div>
  </div>
</template>

<script>
import {
  ProfileUser,
  ProfileAddressCard,
  ProfileAddressForm,
} from "@/modules/profile/components";

export default {
  name: "Profile",
  components: {
    ProfileUser,
    ProfileAddressCard,
    ProfileAddressForm,
  },
  props: {
    user: {
      type: Object,
      default: null,
    },
    addresses: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      isFormShowed: false,
    };
  },
};
</script>
