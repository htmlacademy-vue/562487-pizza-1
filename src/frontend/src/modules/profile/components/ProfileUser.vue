<template>
  <div class="user">
    <UserPicture :user="user" width="72" height="72" />
    <div class="user__name" data-test="user-name">
      <span>{{ user.name }}</span>
    </div>
    <p class="user__phone" data-test="user-phone">
      Контактный телефон: <span>{{ user.phone }}</span>
    </p>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "ProfileUser",
  computed: {
    ...mapState("Auth", ["user"]),
  },
};
</script>

<style lang="scss" scoped>
.user {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 33px;
}

.user__phone {
  font-size: 16px;
  font-weight: 700;
  font-style: normal;
  line-height: 19px;
  width: 100%;
  margin-top: 20px;
}

.user__phone span {
  font-weight: 400;
}
</style>
