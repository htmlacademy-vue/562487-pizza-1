<template>
  <div class="cart__form">
    <div class="cart-form">
      <label class="cart-form__select">
        <span class="cart-form__label">Получение заказа:</span>

        <select
          name="test"
          class="select"
          @change="activeDelivery = +$event.target.value"
        >
          <option
            v-for="delivery in deliveries"
            :key="delivery.id"
            :value="delivery.id"
          >
            {{ delivery.name }}
          </option>
        </select>
      </label>

      <label class="input input--big-label">
        <span>Контактный телефон:</span>
        <input
          type="text"
          name="tel"
          placeholder="+7 999-999-99-99"
          @input="phone = $event.target.value"
        />
      </label>

      <div v-if="activeDelivery === 2" class="cart-form__address">
        <span class="cart-form__label">Новый адрес:</span>

        <div class="cart-form__input">
          <label class="input">
            <span>Улица*</span>
            <input
              type="text"
              name="street"
              @input="address.street = $event.target.value"
            />
          </label>
        </div>

        <div class="cart-form__input cart-form__input--small">
          <label class="input">
            <span>Дом*</span>
            <input
              type="text"
              name="house"
              @change="address.house = $event.target.value"
            />
          </label>
        </div>

        <div class="cart-form__input cart-form__input--small">
          <label class="input">
            <span>Квартира</span>
            <input
              type="text"
              name="apartment"
              @change="address.apartment = $event.target.value"
            />
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const basicDeliveries = [
  {
    id: 1,
    name: "Заберу сам",
  },
  {
    id: 2,
    name: "Новый адрес",
  },
];

export default {
  name: "CartDelivery",
  props: {
    addresses: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      activeDelivery: 1,
      phone: "",
      address: {
        street: "",
        house: "",
        apartment: "",
      },
    };
  },
  computed: {
    deliveries() {
      if (!this.addresses.length) {
        return basicDeliveries;
      }
      const userAddresses = this.addresses.map((address, index) => ({
        id: basicDeliveries.length + index + 1,
        name: address.name,
      }));
      return [...basicDeliveries, ...userAddresses];
    },
  },
};
</script>
