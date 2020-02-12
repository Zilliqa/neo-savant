<template>
  <div class="account-balance d-flex align-items-center mr-4">
    <span class="font-weight-medium">Balance: {{ balance }} ZIL</span>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
const { Zilliqa } = require("@zilliqa-js/zilliqa");
const { units, BN } = require("@zilliqa-js/util");

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
  watch: {
    account: async function() {
      await this.getBalance();
    },
    network: async function() {
      await this.getBalance();
    }
  },
  methods: {
    async getBalance() {
      const zilliqa = new Zilliqa(this.network.url);

      const balance = await zilliqa.blockchain.getBalance(this.account.address);

      if (balance.result.balance) {
        this.balance = units.fromQa(new BN(balance.result.balance), units.Units.Zil);
      } else {
        this.balance = 0;
      }
    }
  },
  mounted() {
      this.getBalance();
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