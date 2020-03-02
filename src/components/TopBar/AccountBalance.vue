<template>
  <div class="account-balance d-flex align-items-center mr-4">
    <span class="font-weight-medium">Balance: {{ balance }} ZIL</span>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
const { Zilliqa } = require("@zilliqa-js/zilliqa");
const { units, BN } = require("@zilliqa-js/util");

import axios from "axios";

export default {
  data() {
    return {
      balance: 0
    };
  },
  computed: {
    ...mapGetters("accounts", { account: "selected" }),
    ...mapGetters("networks", { network: "selected" })
  },
  methods: {
    async getBalance() {
      if (this.account !== undefined && this.account.address) {
        const zilliqa = new Zilliqa(this.network.url);

        const balance = await zilliqa.blockchain.getBalance(
          this.account.address
        );

        if (balance.error && balance.error.code === -5) {
          axios
            .post(process.env.VUE_APP_ISOLATED_FAUCET + "register-account", {
              address: this.account.address
            })
            .then(async response => {
              if (response.data.success === true) {
                return (this.balance = 10000);
              } else {
                this.$notify({
                  group: "scilla",
                  type: "error",
                  position: "bottom right",
                  title: "IDE Internal ERROR",
                  text: "There is a problem with isolated server faucet."
                });
              }
            });
        }

        if (!balance.error && balance.result.balance) {
          this.balance = units.fromQa(
            new BN(balance.result.balance),
            units.Units.Zil
          );
          return this.balance;
        }
        this.balance = 0;

        return 0;
      } else {
        this.balance = 0;
        return 0;
      }
    }
  },
  mounted() {
    this.getBalance();

    window.EventBus.$on("refresh-balance", async () => {
      await this.getBalance();
    });
  }
};
</script>

<style lang="scss" scoped>
.account-selector {
  padding: 0 0.5rem;
  transition: all 0.2s ease;
  color: #000;

  &:hover {
    cursor: pointer;
    background-color: lighten($primary, 10);
  }
}
</style>