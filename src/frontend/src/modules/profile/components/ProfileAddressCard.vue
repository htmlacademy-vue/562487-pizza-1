<template>
  <div class="layout__address">
    <div class="sheet address-form">
      <div class="address-form__header">
        <b data-test="address-name"
          >Адрес №{{ address.id }}. {{ address.name }}</b
        >
        <div class="address-form__edit">
          <button
            type="button"
            class="icon"
            :disabled="isEditDisabled"
            @click="$emit('edit', address.id)"
            data-test="button-edit"
          >
            <span class="visually-hidden">Изменить адрес</span>
          </button>
        </div>
      </div>
      <p data-test="address-info">{{ addressToString }}</p>
      <small v-if="address.comment" data-test="address-comment">{{
        address.comment
      }}</small>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProfileAddressCard",
  props: {
    address: {
      type: Object,
      required: true,
    },
    isEditDisabled: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    addressToString() {
      const { street, building, flat } = this.address;
      let addressString = `${street}, д. ${building}`;
      if (flat) {
        addressString += `, кв. ${flat}`;
      }
      return addressString;
    },
  },
};
</script>
