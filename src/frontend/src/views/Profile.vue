<template>
  <div class="layout__content">
    <div class="layout__title">
      <h1 class="title title--big">Мои данные</h1>
    </div>

    <ProfileUser v-if="user" />
    <ProfileAddressCard
      v-for="address in addresses"
      :key="address.id"
      :address="address"
      :isEditDisabled="isFormShowed"
      @edit="edit"
    />
    <ProfileAddressForm
      v-if="isFormShowed"
      :addressToEdit="addressToEdit"
      @close="close"
    />

    <div v-else class="layout__button">
      <AppButton class="button--border" @click="isFormShowed = true">
        Добавить новый адрес
      </AppButton>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import ProfileUser from "@/modules/profile/components/ProfileUser";
import ProfileAddressCard from "@/modules/profile/components/ProfileAddressCard";
import ProfileAddressForm from "@/modules/profile/components/ProfileAddressForm";
import { Address } from "@/common/models";

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
      addressToEdit: null,
    };
  },
  computed: {
    ...mapState("Auth", ["user", "addresses"]),
  },
  async created() {
    await this.queryAddresses();
  },
  methods: {
    ...mapActions("Auth", ["queryAddresses"]),

    edit(address) {
      this.isFormShowed = true;
      this.addressToEdit = Object.assign({}, address);
    },
    close() {
      this.isFormShowed = false;
      this.addressToEdit = null;
      this.address = Address.createNew();
    },
  },
};
</script>
