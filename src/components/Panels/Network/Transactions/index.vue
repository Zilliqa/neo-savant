<template>
  <div class="contracts-list">
    <div
      class="list-item"
      v-for="tx in list"
      :key="tx.id"
      :class="{
        selected: selected && tx.id === selected.id,
      }"
    >
      <tx-row
        :tx="tx"
        v-on:select-contract="handleSelect"
        :selected="selected && tx.id === selected.id"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import TxRow from "./TxRow";

export default {
  name: "TransactionsList",
  data() {
    return {};
  },
  components: { TxRow },
  computed: {
    ...mapGetters("transactions", ["selected", "list"]),
  },
  created() {},
  methods: {
    importContract() {
      window.EventBus.$emit("open-import-contract");
    },
    handleSelect({ contractId }) {
      window.EventBus.$emit("open-deployed-contract", { contractId });
    },
  },
};
</script>

<style lang="scss" scoped>
.contracts-list {
  .list-item {
    padding-left: 1rem;
    &:hover,
    &.selected {
      background-color: lighten($primary, $amount: 40);
    }
  }
}

.context-menu {
  li {
    a {
      font-size: 14px;
    }
  }
}
</style>
