<template>
  <picture>
    <source
      type="image/webp"
      :srcset="`${userAvatar.webp} 1x,
        ${userAvatar.webp2x} 2x,
        ${userAvatar.webp4x} 4x`"
    />
    <img
      :src="userAvatar.jpg"
      :srcset="`${userAvatar.jpg}, ${userAvatar.jpg2x} 2x, ${userAvatar.jpg4x} 4x`"
      :alt="user.name"
      :width="width"
      :height="height"
    />
  </picture>
</template>

<script>
import { generateAvatar } from "@/common/helpers";

export default {
  name: "UserPicture",
  props: {
    user: {
      type: Object,
      default: null,
    },
    width: {
      type: [Number, String],
      required: true,
    },
    height: {
      type: [Number, String],
      required: true,
    },
  },
  computed: {
    userAvatar() {
      return generateAvatar(this.user.avatar);
    },
  },
};
</script>
