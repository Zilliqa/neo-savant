<template>
  <a
    :href="link"
    target="_blank"
    class="testnet-wallet-link"
  >
    <span>Faucet</span>
  </a>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "TestnetWalletLink",
  computed: {
    ...mapGetters("accounts", { account: "selected" }),
    link() {
      const testnetFaucetUrl = 'https://dev-wallet.zilliqa.com/faucet'
      if (this.account && this.account.address) {
        return testnetFaucetUrl+ `?address=${this.account.address}`
      }
      return testnetFaucetUrl
    }
  }
};
</script>

<style lang="scss">
.address-container {
  width: 100%;
  color: #000;

  &:hover {
    text-decoration: none;
    color: $primary;
  }

  .address {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>