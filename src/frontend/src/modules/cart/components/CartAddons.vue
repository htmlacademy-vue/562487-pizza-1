<template>
  <div class="cart__additional">
    <ul class="additional-list">
      <li
        v-for="addon in addons"
        :key="addon.id"
        class="additional-list__item sheet"
      >
        <p class="additional-list__description">
          <img :src="addon.image" width="39" height="60" :alt="addon.name" />
          <span>{{ addon.name }}</span>
        </p>

        <div class="additional-list__wrapper">
          <ItemCounter
            class="additional-list__counter"
            :count="addon.count"
            :max="ADDON_MAX_COUNT"
            @incrementClick="
              $emit('updateAddons', { id: addon.id, count: addon.count + 1 })
            "
            @decrementClick="
              $emit('updateAddons', { id: addon.id, count: addon.count - 1 })
            "
          />

          <div class="additional-list__price">
            <b>× {{ addon.price * addon.count }} ₽</b>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { ADDON_MAX_COUNT } from "@/common/constants";
import ItemCounter from "@/common/components/ItemCounter.vue";

export default {
  name: "CartAddons",
  components: { ItemCounter },
  props: {
    addons: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      ADDON_MAX_COUNT,
    };
  },
};
</script>
