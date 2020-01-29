<template>
  <div class="account-selector p-4">
    <h4 class="mb-4">Deploy {{file.name}}.scilla</h4>

    <div class="alert alert-info" v-if="abi === undefined">Loading contract ABI</div>

    <div class="deploy-form" v-if="abi && !signedTx">
      <div class="row mb-4">
        <div class="col-12">
          <p class="font-weight-bold">Transaction parameters</p>
        </div>
        <div class="col-12 col-md-4">
          <label>Amount (Uint128)</label>
          <input type="text" v-model="amount" />
        </div>
        <div class="col-12 col-md-4">
          <label>Gas Price (Uint128)</label>
          <input type="text" v-model="gasPrice" />
        </div>
        <div class="col-12 col-md-4">
          <label>Gas Limit (Uint128)</label>
          <input type="text" v-model="gasLimit" />
        </div>
      </div>
      <div class="row mb-4">
        <div class="col-12">
          <p class="font-weight-bold">Initialization parameters</p>
        </div>
        <div class="col-12 mb-4" v-for="param in abi.params" :key="param.vname">
          <contract-input :param="param" v-model="param.value" />
        </div>
      </div>
      <div class="row">
        <div class="col-12 mb-4">
          <p class="font-weight-bold">Deploying from: {{ account.address }}</p>
          <p class="font-weight-bold">Network: {{ network.name }}</p>

          <div v-if="network.url !== 'http://35.246.141.209:5555/'">
            <label>Enter your passphrase to deploy</label>
            <input type="password" v-model="passphrase" class="form-control" />
          </div>
        </div>
        <div class="col-12 mb-4">
          <button class="btn btn-secondary" @click="handleDeploy">Deploy Contract</button>
        </div>
      </div>
    </div>

    <div class="alert alert-info" v-if="loading">{{loading}}</div>
    <div class="alert alert-danger" v-if="error">{{error}}</div>

    <div
      class="alert"
      :class="{'alert-success': signedTx.receipt.success === true, 'alert-danger': signedTx.receipt.success === false}"
      style="overflow-x:scroll;"
      v-if="signedTx"
    >
      <vue-json-pretty :data="{...signedTx}"></vue-json-pretty>
    </div>

    <div class="alert alert-danger" v-if="signedTx && signedTx.receipt.errors">
      <ul>
        <li v-for="err in signedTx.receipt.errors[0]" :key="err">{{ possibleErrors[err] }}</li>
      </ul>
    </div>

    <div class="mt-5">
      <button class="btn btn-danger" @click="resetComponent">Reset</button>
    </div>
  </div>
</template>

<script>
import ContractInput from "./Inputs/ContractInput";

import VueJsonPretty from "vue-json-pretty";
import { BN, units, bytes, Long } from "@zilliqa-js/util";
// import Ledger from '@/utils/zil-ledger-interface';
// import TransportU2F from '@ledgerhq/hw-transport-u2f';
import { Zilliqa } from "@zilliqa-js/zilliqa";
import { mapGetters } from "vuex";
import axios from "axios";

export default {
  data() {
    return {
      abi: undefined,
      init: {},
      amount: 0,
      gasPrice: 1000000000,
      gasLimit: 25000,
      startDeploy: false,
      passphrase: undefined,
      loading: false,
      files: undefined,
      error: false,
      signedTx: undefined,
      possibleErrors: {
        0: "CHECKER_FAILED",
        1: "RUNNER_FAILED",
        5: "NO_GAS_REMAINING_FOUND",
        7: "CALL_CONTRACT_FAILED",
        8: "CREATE_CONTRACT_FAILED"
      }
    };
  },
  components: { VueJsonPretty, ContractInput },
  props: ["file"],
  computed: {
    ...mapGetters("accounts", { account: "selected" }),
    ...mapGetters("networks", { network: "selected" })
  },
  async mounted() {
    if (this.account === null || this.account === undefined) {
      this.error = "Please select an account first.";
      return;
    }
    this.getContractABI();
  },
  methods: {
    async resetComponent() {
      this.abi = undefined;
      this.signedTx = undefined;
      this.error = false;
      this.lading = false;
      this.startDeploy = false;
      await this.getContractABI();
    },
    async handleDeploy() {
      try {
        this.loading = "Trying to decrypt keystore file and access wallet...";

        if (this.zilliqa === undefined) {
          this.zilliqa = new Zilliqa(this.network.url);
        }

        let loaded = null;

        if (this.network.url !== "http://35.246.141.209:5555/") {
          if (this.passphrase === "" || this.passphrase === undefined) {
            throw new Error("Please enter passphrase.");
          }

          loaded = await this.zilliqa.wallet.addByKeystore(
            this.account.keystore,
            this.passphrase
          );
        } else {
          loaded = await this.zilliqa.wallet.addByPrivateKey(
            this.account.privateKey
          );
        }

        if (loaded == null) {
          throw new Error("Error on loading account");
        }

        // Verify if account is created on blockchain
        const balance = await this.zilliqa.blockchain.getBalance(loaded);

        if (balance.error !== undefined) {
          throw new Error(balance.error.message);
        }

        const zils = units.fromQa(
          new BN(balance.result.balance),
          units.Units.Zil
        );
        if (zils < 20) {
          throw new Error(
            "You account should have more than 20 ZIL to be able to perform multisig actions."
          );
        }

        this.loading =
          "Trying to sign and send transaction... this might take between 3-5 minutes.";

        const chainId = this.network.chainId; // chainId of the developer testnet
        const msgVersion = this.network.msgVersion; // current msgVersion
        const VERSION = bytes.pack(chainId, msgVersion);

        const init = [...this.abi.params];

        if(this.network.url === 'http://35.246.141.209:5555/') {
        init.push({
          vname: "_scilla_version",
          type: "Uint32",
          value: "0"
        });
        }

        const tx = this.zilliqa.transactions.new({
          version: VERSION,
          toAddr: "0x0000000000000000000000000000000000000000",
          amount: new BN(this.amount),
          gasPrice: new BN(this.gasPrice), // in Qa
          gasLimit: Long.fromNumber(this.gasLimit),
          code: this.file.code,
          data: JSON.stringify(init).replace(/\\"/g, '"')
        });

        const signedTx = await this.zilliqa.blockchain.createTransaction(tx);

        const contractId = await this.zilliqa.blockchain.getContractAddressFromTransactionID(
          tx.id
        );

        const contract = {
          transId: signedTx.id,
          txData: signedTx,
          contractId: contractId.result,
          network: this.network.url,
          file_id: this.file.id,
          file_name: this.file.name,
          deployed_by: this.account.address
        };

        console.log("deployed contract ", contract);

        if (signedTx.receipt.success !== false) {
          await this.$store
            .dispatch("contracts/AddContract", contract)
            .then(() => {
              this.signedTx = {
                receipt: signedTx.receipt,
                transId: signedTx.id,
                contractAddress: contractId.result
              };
            });
        } else {
          this.signedTx = {
            receipt: signedTx.receipt,
            transId: signedTx.id,
            contractAddress: contractId.result
          };
        }
      } catch (error) {
        this.loading = false;
        this.error = error.message;
      }
    },
    async getContractABI() {
      axios
        .post(process.env.VUE_APP_SCILLA_CHECKER_URL, {
          code: this.file.code
        })
        .then(response => {
          if (response.data.result === "success") {
            const { contract_info } = JSON.parse(response.data.message);

            this.abi = contract_info;

            // this.checked = true;
            this.$notify({
              group: "scilla",
              type: "success",
              position: "bottom right",
              title: "Scilla Checker",
              text: "Contract has been successfully checked"
            });
          }
        })
        .catch(() => {
          this.$notify({
            group: "scilla",
            type: "error",
            position: "bottom right",
            title: "Scilla Checker",
            text: "There are errors in your contract. Check the editor."
          });
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.accounts-list {
  .item {
    border: 1px dashed #ccc;
    background-color: rgba(0, 0, 0, 0.02);
    border-radius: 8px;
    transition: all 0.2s ease-in-out;

    &:hover {
      background-color: rgba(0, 0, 0, 0.1);
      cursor: pointer;
    }
  }
}

.btn {
  font-size: 0.85rem !important;
}
</style>