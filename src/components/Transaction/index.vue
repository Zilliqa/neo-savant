<template>
  <loading v-if="loading" />

  <div class="transaction-form" v-else>
    <div class="row mb-4">
      <transaction-input
        class="col-12 col-md-4"
        v-model="amount"
        :def="amount"
        name="Amount"
        type="Uint128"
      />
      <transaction-input
        class="col-12 col-md-4"
        v-model="gasPrice"
        :def="gasPrice"
        name="Gas Price"
        type="Uint128"
      />
      <transaction-input
        class="col-12 col-md-4"
        v-model="gasLimit"
        :def="gasLimit"
        name="Gas Limit"
        type="Uint128"
      />
    </div>
    <div class="row">
      <contract-input
        class="col-12 mb-4"
        v-for="param in parsedParams"
        :key="param.vname"
        :error="param.validationErrors"
        :vname="param.vname"
        :type="param.type"
        :pvalue="param.value"
        v-model="param.value"
      />
    </div>
    <div class="row">
      <div class="col-12">
        <button class="btn btn-secondary btn-block" @click="handleGenerate">
          Generate transaction
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import Loading from "@/components/UI/Loading";

import TransactionInput from "./TransactionInput";
import ContractInput from "@/components/Inputs/ContractInput";

import ZilliqaMixin from "@/mixins/zilliqa";

export default {
  data() {
    return {
      loading: true,
      error: false,
      parsedParams: [],
      amount: 0,
      gasPrice: 0,
      gasLimit: 25000,
      signedTx: undefined,
    };
  },
  props: {
    params: Array,
    code: String,
  },
  mixins: [ZilliqaMixin],
  components: { TransactionInput, Loading, ContractInput },
  async created() {
    this.gasPrice = await this.getMinimumGasPrice();
    this.parsedParams = [...this.params];
    this.loading = false;
  },
  methods: {
    async handleGenerate() {
      this.error = false;

      const validatedParams = this.validateParamsObject(this.parsedParams);

      if (validatedParams.errors) {
        this.parsedParams = validatedParams.params;
        this.error = "Please fix the errors in your inputs";
        return;
      }

      const data = this.prepareDataObject(this.parsedParams);

      const tx = this.prepareTransaction({
        amount: this.amount,
        gasPrice: this.gasPrice,
        gasLimit: this.gasLimit,
        code: this.code,
        data,
      });

      console.log(tx);
    },
  },
};
</script>
