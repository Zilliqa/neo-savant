<template>
  <div class="contracts-list">
    <div
      class="list-item"
      v-for="contract in list"
      :key="contract.id"
      :class="{
        selected: selected && contract.contractId === selected.contractId,
      }"
    >
      <contract-name
        :contract="contract"
        v-on:select-contract="handleSelect"
        :selected="selected && contract.contractId === selected.contractId"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import ContractName from "./ContractName";

export default {
  name: "ContractsList",
  data() {
    return {};
  },
  components: { ContractName },
  computed: {
    ...mapGetters("contracts", ["selected", "list"]),
  },
  created() {},
  methods: {
    importContract() {
      // this.$store.dispatch('incrementBy', amount)
      window.EventBus.$emit("open-import-contract");
    },
    handleSelect({ contractId }) {
      window.EventBus.$emit("open-editor-contract", { contractId });
      window.EventBus.$emit("open-call-contract", { contractId });
      //this.$store.dispatch("contracts/SelectContract", { contractId });
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
