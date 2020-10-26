<template>
  <div class="content">
    <transaction-watcher
      class="text-small"
      v-for="transaction in transactions"
      :key="transaction.id"
      :transaction="transaction"
    />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import TransactionWatcher from "./TransactionWatcher";

export default {
  components: {
    TransactionWatcher,
  },
  computed: {
    ...mapGetters("transactions", { transactions: "watcherList" }),
  },
};
</script>

<style lang="scss" scoped>
.content {
  padding: 0.5rem;
}
</style>