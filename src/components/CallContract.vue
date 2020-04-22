<template>
  <div class="panel-content">
    <div class="header">
      <div class="title">{{ contractId }}</div>
      <img src="@/assets/close-color.svg" @click="handleClose" class="close-button-new" />
    </div>
    <div class="body p-4">
      <div class="alert alert-info" v-if="!abi">Loading contract ABI</div>

      <div class="contract-transitions" v-if="abi">
        <p class="mb-2">Transitions</p>

        <div class="transitions mb-4">
          <button
            class="btn btn-secondary mr-2 mb-2"
            v-for="transition in abi.transitions"
            :key="transition.vname"
            @click="exec = transition"
            :class="{'faded': exec && exec.vname !== transition.vname}"
          >{{ transition.vname }}</button>
        </div>
      </div>

      <div v-if="!exec && contractState">
        <p class="mt-4 mb-2 d-flex align-items-center">
          Contract State
          <img
            src="@/assets/refresh.svg"
            class="refresh-state-button"
            @click="refreshContractState"
          />
        </p>
        <div style="width: 100%; overflow-x:scroll;">
          <vue-json-pretty :deep="1" :data="contractState"></vue-json-pretty>
        </div>
      </div>

      <div v-if="contractInit && !exec">
        <p class="mb-2">Contract Init</p>
        <div style="width: 100%; overflow-x:scroll;">
          <vue-json-pretty :deep="2" :data="contractInit"></vue-json-pretty>
        </div>
      </div>

      <div class="deploy-form" v-if="abi && exec">
        <div class="row mb-4">
          <div class="col-12">
            <p class="font-weight-bold">Transaction parameters</p>
          </div>
          <div class="col-12 col-md-4">
            <label>Amount (Uint128)</label>
            <input type="text" v-model="amount" class="form-control" />
          </div>
          <div class="col-12 col-md-4">
            <label>Gas Price (Uint128)</label>
            <input type="text" v-model="gasPrice" class="form-control" />
          </div>
          <div class="col-12 col-md-4">
            <label>Gas Limit (Uint128)</label>
            <input type="text" v-model="gasLimit" class="form-control" />
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <p class="font-weight-bold">Transition parameters ({{exec.vname}})</p>
          </div>
          <div class="col-12 mb-4" v-for="param in exec.params" :key="param.vname">
            <contract-input :param="param" v-model="param.value" />
          </div>
        </div>
        <div class="row">
          <div class="col-12 mb-4">
            <p class="font-weight-bold mb-0">Calling from: {{ account.address }}</p>
            <p class="font-weight-bold">Network: {{ network.name }}</p>
            <div v-if="network.url !== VUE_APP_ISOLATED_URL">
              <label>Enter your passphrase</label>
              <input type="password" v-model="passphrase" class="form-control" />
            </div>
          </div>
          <div class="col-12 mb-4" v-if="!loading">
            <button class="btn btn-secondary mr-2" @click="handleCall">Call Transition</button>
            <button class="btn btn-danger" @click="handleCancel">Cancel</button>
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
      VUE_APP_ISOLATED_URL: process.env.VUE_APP_ISOLATED_URL,
      abi: undefined,
      exec: false,
      contractState: undefined,
      contractInit: undefined,
      contractCode: undefined,
      init: {},
      amount: 0,
      gasPrice: 1000000000,
      gasLimit: 25000,
      startDeploy: false,
      zilliqa: undefined,
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
  props: ["contractId"],
  computed: {
    ...mapGetters("accounts", { account: "selected" }),
    ...mapGetters("contracts", { contract: "selected" }),
    ...mapGetters("networks", { network: "selected" })
  },
  async mounted() {
    this.zilliqa = new Zilliqa(this.network.url);

    this.contractInit = (
      await this.zilliqa.blockchain.getSmartContractInit(this.contractId)
    ).result;

    await this.refreshContractState();

    const contractCode = await this.zilliqa.blockchain.getSmartContractCode(
      this.contractId
    );

    this.contractCode = contractCode.result.code;

    this.abi = await this.getContractAbi();
  },
  methods: {
    handleClose() {
      window.EventBus.$emit("close-right-panel");
    },
    async refreshContractState() {
      this.contractState = (
        await this.zilliqa.blockchain.getSmartContractState(this.contractId)
      ).result;
    },
    async handleCancel() {
      this.exec = false;
      this.signedTx = undefined;
      this.loading = false;
      this.error = false;

      await this.refreshContractState();
    },
    getContractAbi() {
      axios
        .post(process.env.VUE_APP_SCILLA_CHECKER_URL, {
          code: this.contractCode
        })
        .then(response => {
          if (response.data.result === "success") {
            const { contract_info } = JSON.parse(response.data.message);

            this.abi = contract_info;
          }
        });
    },
    toScillaParams(fields) {
      return Object.keys(fields).map(name => {
        return {
          vname: name,
          value: this.init[name],
          type: fields[name].type
        };
      });
    },
    async handleCall() {
      try {
        this.loading = "Trying to decrypt keystore file and access wallet...";

        if (this.zilliqa === undefined) {
          this.zilliqa = new Zilliqa(this.network.url);
        }

        let loaded = null;

        if (this.network.url !== process.env.VUE_APP_ISOLATED_URL) {
          if (this.passphrase === "" || this.passphrase === undefined) {
            throw new Error("Please enter passphrase.");
          }

          loaded = await this.zilliqa.wallet.addByKeystore(
            this.account.keystore,
            this.passphrase
          );
        } else {
          loaded = await this.zilliqa.wallet.addByPrivateKey(
            this.account.keystore
          );
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

        const init = [...this.exec.params];

        /* init.push({
          vname: "_scilla_version",
          type: "Uint32",
          value: "0"
        }); */

        const tx = this.zilliqa.transactions.new({
          version: VERSION,
          toAddr: this.contractId,
          amount: new BN(this.amount),
          gasPrice: new BN(this.gasPrice), // in Qa
          gasLimit: Long.fromNumber(this.gasLimit),
          data: JSON.stringify({
            _tag: this.exec.vname,
            params: init
          })
        });

        const signedTx = await this.zilliqa.blockchain.createTransaction(tx);

        this.loading = false;

        if (signedTx.receipt.success !== false) {
          this.signedTx = {
            receipt: signedTx.receipt,
            transId: signedTx.id
          };
          if (
            signedTx.receipt.event_logs &&
            signedTx.receipt.event_logs.length
          ) {
            await this.$store.dispatch(
              "events/AddEvents",
              signedTx.receipt.event_logs
            );
          }
        } else {
          this.signedTx = {
            receipt: signedTx.receipt,
            transId: signedTx.id
          };
        }
        window.EventBus.$emit("refresh-balance");
        this.signedTx = { receipt: signedTx.receipt, transId: signedTx.id };
      } catch (error) {
        this.loading = false;
        this.error = error.message;
        window.EventBus.$emit("refresh-balance");
      }
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

  &.faded {
    opacity: 0.5;
  }
}

.refresh-state-button {
  opacity: 0.8;
  height: 16px;
  margin-left: 0.5rem;

  &:hover {
    cursor: pointer;
    opacity: 1;
  }
}
</style>