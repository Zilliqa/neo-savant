<template>
  <div class="panel contracts-list">
    <div
      class="header text-primary d-flex justify-content-between align-items-center"
    >
      NETWORK
    </div>
    <div class="panel-body">
      <div class="ml-3 mb-0"><small>Network address</small></div>
      <div class="ml-3 mb-0"><small>Current block</small></div>
      <p class="ml-3 mt-3 mb-0">CONTRACTS</p>
      <contracts />
      <p class="ml-3 mt-3 mb-0">TRANSACTIONS</p>
    </div>
  </div>
</template>

<script>
import Contracts from "./Contracts";

export default {
  name: "NetworkPanel",
  data() {
    return {};
  },
  components: { Contracts },
};
</script>

<style lang="scss" scoped></style>
