<template>
  <div class="bottom-panel">
    <div class="header">
      <div
        class="tab d-flex align-items-center"
        :class="{ active: tab === 'checker' }"
        @click="handleSelect('checker')"
      >
        <img height="13px" class="pr-1" src="@/assets/clipboard.svg" /> Checker
      </div>
      <div
        class="tab d-flex align-items-center"
        :class="{ active: tab === 'transactions' }"
        @click="handleSelect('transactions')"
      >
        <img height="13px" class="pr-1" src="@/assets/notifications.svg" />
        Ongoing Transactions
      </div>
    </div>
    <div class="body" v-if="active">
      <checker-tab v-if="tab === 'checker'" />
      <transactions-tab v-if="tab === 'transactions'" />
    </div>
  </div>
</template>

<script>
import CheckerTab from "./Checker";
import TransactionsTab from "./Transactions";

export default {
  data() {
    return {
      tab: "checker",
    };
  },
  props: ["active"],
  components: { CheckerTab, TransactionsTab },
  methods: {
    handleSelect(tab) {
      this.tab = tab;
    },
  },
};
</script>

<style lang="scss" scoped>
.bottom-panel {
  max-height: 150px;
  overflow: hidden;
  z-index: 9999;
  background-color: #fff;

  border-top: 1px solid transparentize($color: #ccc, $amount: 0.55);

  .header {
    width: 100%;
    font-size: 0.8rem;
    height: 1.25rem;
    display: flex;

    .tab {
      background-color: #fff;
      padding-left: 0.5rem;
      padding-right: 0.5rem;
      z-index: 999;
      cursor: pointer;

      &:hover,
      &.active {
        background-color: $accent;
      }
    }
  }

  .body {
    height: calc(150px - 1.25rem);
    background-color: darken($color: #fff, $amount: 5);
    overflow-y: scroll;
  }
}
</style>