<template>
  <div
    class="account-balance d-flex align-items-center mr-4"
    :class="{ 'not-loading': !balanceLoading }"
    @click="getBalance"
  >
    <span class="font-weight-medium" v-if="!balanceLoading">{{ balance }}</span>
    <i class="fas fa-spinner fa-spin" v-else></i>
    <span class="ml-1">ZIL</span>
    <i class="fas fa-sync ml-2 text-small"></i>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
const { Zilliqa } = require("@zilliqa-js/zilliqa");
const { units, BN } = require("@zilliqa-js/util");

import axios from "axios";
import numbro from "numbro";

export default {
  name: "AccountBalance",
  data() {
    return {
      internalBalance: 0,
      balanceLoading: true,
    };
  },
  computed: {
    ...mapGetters("accounts", { account: "selected" }),
    ...mapGetters("networks", { network: "selected" }),
    balance() {
      return numbro(this.internalBalance).format({ thousandSeparated: true });
    },
  },
  props: {
    address: {
      type: String,
      default: undefined,
    },
  },
  methods: {
    async getBalance() {
      this.balanceLoading = true;
      if (this.account !== undefined && this.account.address) {
        const zilliqa = new Zilliqa(this.network.url);

        const balance = await zilliqa.blockchain.getBalance(
          this.account.address
        );

        if (
          balance.error &&
          balance.error.code === -5 &&
          this.network.url === process.env.VUE_APP_ISOLATED_URL
        ) {
          return axios
            .post(process.env.VUE_APP_ISOLATED_FAUCET + "register-account", {
              address: this.account.address,
            })
            .then(async (response) => {
              if (response.data.success === true) {
                return this.getBalance();
              } else {
                this.$notify({
                  group: "scilla",
                  type: "error",
                  position: "bottom right",
                  title: "IDE Internal ERROR",
                  text: "There is a problem with isolated server faucet.",
                });
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }

        if (!balance.error && balance.result.balance) {
          this.internalBalance = units.fromQa(
            new BN(balance.result.balance),
            units.Units.Zil
          );
          this.balanceLoading = false;
          return this.balance;
        }
        this.balanceLoading = false;
        this.internalBalance = 0;

        return 0;
      } else {
        this.balanceLoading = false;
        this.internalBalance = 0;
        return 0;
      }
    },
  },
  mounted() {
    this.getBalance();

    window.EventBus.$on("refresh-balance", async () => {
      await this.getBalance();
    });
  },
};
</script>