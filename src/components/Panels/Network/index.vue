<template>
  <div class="panel contracts-list">
    <div
      class="
        header
        text-primary
        d-flex
        justify-content-between
        align-items-center
      "
    >
      NETWORK
    </div>
    <div class="panel-body">
      <div class="ml-3 mb-0">
        <div>Network address</div>
        <small>{{ network.url }}</small>
      </div>
      <div class="ml-3 mb-0"><small>Current block</small></div>
      <p class="ml-3 mt-3 mb-0">CONTRACTS</p>
      <contracts />
      <p class="ml-3 mt-3 mb-0">TRANSACTIONS</p>
      <transactions />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Contracts from "./Contracts";
import Transactions from "./Transactions";

export default {
  name: "NetworkPanel",
  data() {
    return {};
  },
  computed: {
    ...mapGetters("networks", { network: "selected" }),
  },
  components: { Contracts, Transactions },
};
</script>

<style lang="scss" scoped></style>
