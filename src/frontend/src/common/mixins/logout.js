export default {
  methods: {
    async $logout() {
      try {
        await this.$store.dispatch("Auth/logout");
        this.$notifier.success("Вы успешно вышли");
        this.$router.push("/login");
      } catch {
        return;
      }
    },
  },
};
