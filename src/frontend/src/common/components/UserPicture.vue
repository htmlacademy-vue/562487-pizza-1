<template>
  <picture>
    <source type="image/webp" :srcset="webpSrcset" />
    <img
      :src="avatarsSet.jpg"
      :srcset="jpgSrcset"
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
    isBigSize() {
      const bigSize = "72";
      return this.width.toString() === bigSize;
    },
    avatarsSet() {
      return generateAvatar(this.user.avatar);
    },
    webpSrcset() {
      const avatars = this.avatarsSet;
      return this.isBigSize
        ? `${avatars.webp2x} 2x, ${avatars.webp4x} 4x`
        : `${avatars.webp} 1x, ${avatars.webp2x} 2x`;
    },
    jpgSrcset() {
      const avatars = this.avatarsSet;
      return this.isBigSize
        ? `${avatars.jpg2x} 2x, ${avatars.jpg4x} 4x`
        : `${avatars.jpg} 1x, ${avatars.jpg2x} 2x`;
    },
  },
};
</script>
