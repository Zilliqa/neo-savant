<template>
  <div class="panel events-list">
    <div
      class="header text-primary d-flex justify-content-between align-items-center"
    >
      DEBUG - SCILLA CHECKER
    </div>
    <div class="panel-body p-3">
      <loading v-if="loading" />
      <div v-else>
        <button
          class="btn btn-secondary btn-lg btn-block mb-4"
          @click="handleRunChecker"
        >
          Run scilla-checker on {{ contract.name }}
        </button>

        <cashflow-tags
          v-if="debug && debug.cashflow_tags"
          :tags="debug.cashflow_tags"
          class="mb-4"
        />

        <contract-info
          v-if="debug && debug.contract_info"
          :contract_info="debug.contract_info"
        />

        <div
          class="alert alert-danger text-small"
          v-if="debug && !debug.contract_info"
        >
          Scilla checker failed on contract.
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import ScillaChecker from "@/mixins/scilla-checker";
import CashflowTags from "./CashflowTags";
import ContractInfo from "./ContractInfo";
import Loading from "@/components/UI/Loading";

export default {
  data() {
    return {
      loading: false,
      debug: null,
    };
  },
  components: { CashflowTags, ContractInfo, Loading },
  mixins: [ScillaChecker],
  computed: {
    ...mapGetters("files", { contract: "selected" }),
  },
  methods: {
    async handleRunChecker() {
      this.loading = true;
      this.debug = await this.runScillaChecker({
        code: this.contract.code,
        name: this.contract.name,
      });

      this.loading = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.clear-events {
  cursor: pointer;
}
.events-list {
  position: relative;
}
</style>
