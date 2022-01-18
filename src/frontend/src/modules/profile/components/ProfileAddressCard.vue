<template>
  <div class="layout__address">
    <div class="sheet address-form">
      <div class="address-form__header">
        <b>Адрес №{{ address.id }}. {{ address.name }}</b>
        <div class="address-form__edit">
          <button type="button" class="icon">
            <span class="visually-hidden">Изменить адрес</span>
          </button>
        </div>
      </div>
      <p>
        {{ address.street }}, д. {{ address.building }}, кв.
        {{ address.flat }}
      </p>
      <small v-if="address.comment">{{ address.comment }}</small>
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
  },
};
</script>
