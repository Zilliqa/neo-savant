<template>
  <div class="account-selector p-4">
    <p>
      Contract Address
      <br />
      <span class="font-weight-bold">0x{{contractId}}</span>
    </p>

    <div class="alert alert-info" v-if="!abi">Loading contract ABI</div>

    <div class="contract-transitions" v-if="abi">
      <p class="mb-2">Transitions</p>

      <div class="transitions mb-4">
        <button
          class="btn btn-secondary mr-2"
          v-for="transition in abi.transitions"
          :key="transition.vname"
          @click="exec = transition"
          :class="{'faded': exec && exec.vname !== transition.vname}"
        >{{ transition.vname }}</button>
      </div>
    </div>

    <div v-if="!exec && contractState">
      <p class="mt-4 mb-2">Contract State</p>
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
      <div class="row">
        <div class="col-12">
          <p class="font-weight-bold">Transition parameters ({{exec.vname}})</p>
        </div>
        <div class="col-12 mb-4" v-for="param in exec.params" :key="param.vname">
          <label>{{param.vname}} ({{param.type}})</label>
          <input
            type="text"
            v-model="init[param.vname]"
            class="form-control"
            v-if="(param.type === 'String' || param.type === 'ByStr20')"
          />
          <textarea v-model="init[param.vname]" class="form-control" v-else></textarea>
        </div>
      </div>
      <div class="row">
        <div class="col-12 mb-4">
          <p class="font-weight-bold mb-0">Calling from: {{ account.address }}</p>
          <p class="font-weight-bold">Network: {{ network.name }}</p>
          <label>Enter your passphrase to call</label>
          <input type="password" v-model="passphrase" class="form-control" />
        </div>
        <div class="col-12 mb-4">
          <button class="btn btn-secondary mr-2" @click="handleCall">Call Transition</button>
          <button class="btn btn-danger" @click="exec = false">Cancel</button>
        </div>
      </div>
    </div>

    <div class="alert alert-info" v-if="loading">{{loading}}</div>
    <div class="alert alert-danger" v-if="error">{{error}}</div>
  </div>
</template>

<script>
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
      exec: false,
      contractState: undefined,
      contractInit: undefined,
      contractCode: undefined,
      init: {},
      amount: 0,
      gasPrice: 1000000000,
      gasLimit: 25000,
      startDeploy: false,
      passphrase: undefined,
      loading: false,
      files: undefined,
      error: false,
      signedTx: undefined
    };
  },
  components: { VueJsonPretty },
  props: ["contractId"],
  computed: {
    ...mapGetters("accounts", { account: "selected" }),
    ...mapGetters("contracts", { contract: "selected" }),
    ...mapGetters("networks", { network: "selected" })
  },
  async mounted() {
    const zilliqa = new Zilliqa(this.network.url);

    this.contractInit = (
      await zilliqa.blockchain.getSmartContractInit(this.contractId)
    ).result;

    this.contractState = (
      await zilliqa.blockchain.getSmartContractState(this.contractId)
    ).result;

    const contractCode = (
      await zilliqa.blockchain.getSmartContractCode(this.contractId)
    );
    console.log(contractCode.result);

    this.contractCode = null;

    this.abi = await this.getContractAbi();
  },
  methods: {
    getContractAbi() {
      axios
        .post("https://scilla-runner.zilliqa.com/contract/check", {
          code: this.contractCode
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

        if (this.passphrase === "" || this.passphrase === undefined) {
          throw new Error("Please enter passphrase.");
        }

        const loaded = await this.zilliqa.wallet.addByKeystore(
          JSON.stringify(this.account.keystore),
          this.passphrase
        );

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

        const abiParams = this.abi.params.reduce(
          (acc, { vname, type }) => ({
            ...acc,
            [vname]: { value: "", type, touched: false, error: false }
          }),
          {}
        );

        const init = this.toScillaParams(abiParams);
        init.push({
          vname: "_scilla_version",
          type: "Uint32",
          value: "0"
        });

        const tx = this.zilliqa.transactions.new({
          version: VERSION,
          toAddr: this.contractId,
          amount: new BN(this.amount),
          gasPrice: new BN(this.gasPrice), // in Qa
          gasLimit: Long.fromNumber(this.gasLimit),
          data: JSON.stringify({
            _tag: "AddFunds",
            params: init
          })
        });

        const signedTx = await this.zilliqa.blockchain.createTransaction(tx);

        this.signedTx = { receipt: signedTx.receipt, transId: signedTx.id };
      } catch (error) {
        this.loading = false;
        this.error = error.message;
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
</style>