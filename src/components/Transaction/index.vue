<template>
  <loading v-if="loading" />

  <div v-else>
    <div v-if="signedTx">
      <div class="alert alert-success overflow-hidden">
        Transaction has been successfully sent to the network.
      </div>
      <div class="overflow-hidden mb-4">
        <span class="text-monospace">ID: 0x{{ signedTx.id }}</span>
      </div>
      <explorer-link :txid="signedTx.id" />
    </div>
    <div class="transaction-form" v-else>
      <div v-if="preparedTx && preparedTx.txParams">
        <p class="font-weight-bold text-muted">Generated transaction</p>
        <MonacoEditor
          class="editor mb-4"
          :value="JSON.stringify(preparedTx.txParams, null, 2)"
          :options="monacoOptions"
          language="json"
        />

        <button class="btn btn-secondary btn-block" @click="handleSign">
          Sign and send transaction
        </button>
      </div>
      <div v-else>
        <div class="row mb-4">
          <transaction-input
            class="col-12 mb-2"
            v-model="amount"
            :def="amount"
            name="Amount"
            type="Uint128"
          />
          <transaction-input
            class="col-12 mb-2"
            v-model="gasPrice"
            :def="gasPrice"
            name="Gas Price"
            type="Uint128"
          />
          <transaction-input
            class="col-12"
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
              Generate tx for {{ file.name }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Loading from "@/components/UI/Loading";

import TransactionInput from "./TransactionInput";
import ContractInput from "@/components/Inputs/ContractInput";
import ExplorerLink from "@/components/UI/ExplorerLink";
import MonacoEditor from "vue-monaco";

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
      preparedTx: undefined,
      monacoOptions: {
        minimap: {
          enabled: false,
        },
        lineNumbers: false,
        readOnly: true,
      },
    };
  },
  props: {
    params: Array,
    code: String,
    file: Object,
  },
  mixins: [ZilliqaMixin],
  components: {
    TransactionInput,
    Loading,
    ContractInput,
    MonacoEditor,
    ExplorerLink,
  },
  async created() {
    this.gasPrice = await this.getMinimumGasPrice();
    this.parsedParams = [...this.params];
    this.loading = false;
  },
  methods: {
    async handleGenerate() {
      this.error = false;
      this.loading = true;

      const validatedParams = this.validateParamsObject(this.parsedParams);

      if (validatedParams.errors) {
        this.parsedParams = validatedParams.params;
        this.error = "Please fix the errors in your inputs";
        return;
      }

      const data = this.prepareDataObject(this.parsedParams);

      this.preparedTx = this.zilliqaPrepareTransaction({
        amount: this.amount,
        gasPrice: this.gasPrice,
        gasLimit: this.gasLimit,
        code: this.code,
        data,
      });
      this.loading = false;
    },
    async handleSign() {
      this.loading = true;
      try {
        this.signedTx = await this.zilliqaHandleSign(this.preparedTx);

        this.$store.dispatch("transactions/AddTx", {
          ...this.signedTx,
          file: this.file,
        });

        this.loading = false;
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>


<style lang="scss" scoped>
.editor {
  width: 100%;
  height: 250px;
}
</style>