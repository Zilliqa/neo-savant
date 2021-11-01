<template>
  <div class="top-bar d-flex">
    <div class="menus flex-grow-1 d-flex justify-content-between">
      <div class="main d-flex align-items-center mr-5">
        <a
          href="https://scilla.readthedocs.io/en/latest/"
          target="_blank"
          class="mr-3"
          >Scilla Docs</a
        >
        <a href="https://learnscilla.com" target="_blank">Tutorial</a>
        <li class="tools-menu">
          <a href="#">Tools</a>

          <ul class="submenu">
            <li>
              <a href="#" @click="handleOpenTools('units-converter')"
                >Units Converter</a
              >
            </li>
            <li>
              <a href="#" @click="handleOpenTools('address-converter')"
                >Address Converter</a
              >
            </li>
          </ul>
        </li>
        <explorer-link />
        <testnet-wallet-link v-if="isTestnet" class="ml-3"/>
        <a
          href="#"
          v-if="isIsolatedServer"
          @click="handleOpenFaucet"
          class="ml-3"
        >Faucet</a>
      </div>
      <div class="details d-none">
        <account-balance />
        <account-selector />
        <network-selector />
      </div>
    </div>
  </div>
</template>

<script>
import NetworkSelector from "./NetworkSelector";
import AccountSelector from "./AccountSelector";
import AccountBalance from "./AccountBalance";
import ExplorerLink from "../UI/ExplorerLink";
import TestnetWalletLink from "../UI/TestnetWalletLink";

import { mapGetters } from "vuex";

export default {
  name: "TopBar",
  components: {
    NetworkSelector,
    AccountSelector,
    AccountBalance,
    ExplorerLink,
    TestnetWalletLink,
  },
  computed: {
    ...mapGetters("networks", { selectedNetwork: "selected" }),
    isIsolatedServer() {
      return this.selectedNetwork.url === process.env.VUE_APP_ISOLATED_URL
    },
    isTestnet() {
      return this.selectedNetwork.url === 'https://dev-api.zilliqa.com'
    },
  },
  methods: {
    handleOpenTools(toolName) {
      window.EventBus.$emit("open-tools", toolName);
    },
    handleOpenFaucet() {
      window.EventBus.$emit("open-faucet");
    },
  },
};
</script>

<style lang="scss" scoped>
.top-bar {
  background: $primary;
  position: relative;

  width: 100%;
  height: 28px;

  padding-left: calc(40px + 1rem);
  padding-right: 2rem;

  font-size: 14px;

  a {
    color: #fff;
  }

  .tools-menu {
    list-style: none;
    margin-left: 1rem;
    margin-right: 1rem;
    position: relative;

    .submenu {
      display: none;
      flex-direction: column;
      position: absolute;
      left: 0;
      width: 150px;
      list-style: none;
      padding: 0;
      background-color: saturate($primary, 80);
      z-index: 99;
      padding-top: 0.5rem;

      li {
        padding: 0.5rem;
      }
    }

    &:hover {
      .submenu {
        display: flex;
      }
    }
  }
}
</style>
