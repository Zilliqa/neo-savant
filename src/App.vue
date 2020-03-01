<template>
  <div id="app">
    <notifications group="scilla" />
    <top-bar />
    <div class="ide" :class="{'only2': !rightPanel}">
      <div id="left-panel" class="left-panel">
        <files-list />
        <contracts-list />
      </div>
      <div class="main-panel">
        <router-view />
      </div>
      <div class="right-panel" v-show="rightPanel">
        <account-selector v-if="rightPanel === 'accountSelector'" />
        <console v-if="rightPanel === 'console'" />
        <events-list v-if="rightPanel === 'events'" />
        <settings v-if="rightPanel === 'settings'" />
        <deploy-contract
          v-if="rightPanel === 'deployContract'"
          :file="this.deployContract"
          :key="this.deployContract.id"
        />
        <call-contract
          v-if="rightPanel === 'callContract'"
          :contractId="this.callContract"
          :key="this.callContract"
        />
        <import-contract v-if="rightPanel === 'importContract'" />
      </div>
      <div class="right-sidebar">
        <div class="action" @click="handleToggleRightPanel('console')">
          <img src="@/assets/terminal.svg" />
        </div>

        <div class="action events-badge" @click="handleToggleRightPanel('events')">
          <img src="@/assets/notifications.svg" />

          <span class="badge badge-danger" v-if="events.length">{{ events.length }}</span>
        </div>

        <div class="action" @click="handleToggleRightPanel('settings')">
          <img src="@/assets/industry.svg" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FilesList from "@/components/Files/List";
import ContractsList from "@/components/Contracts/List";
import TopBar from "@/components/TopBar/index";
import AccountSelector from "@/components/AccountSelector";
import Console from "@/components/Console";
import DeployContract from "@/components/DeployContract";
import CallContract from "@/components/CallContract";
import ImportContract from "@/components/ImportContract";
import EventsList from "@/components/EventsList";
import Settings from "@/components/Settings";

import { mapGetters } from "vuex";
import axios from "axios";

import { BN, bytes, Long } from "@zilliqa-js/util";
import { Zilliqa } from "@zilliqa-js/zilliqa";
import { generateMultipleZilliqaAccounts } from "./utils/zilliqa";
import { animateCSS } from "./utils/ui";

export default {
  name: "App",
  data() {
    return {
      rightPanel: "console",
      deployContract: false,
      callContract: false,
      zilliqa: undefined,
      VERSION: undefined
    };
  },
  components: {
    FilesList,
    ContractsList,
    TopBar,
    AccountSelector,
    Console,
    DeployContract,
    CallContract,
    ImportContract,
    EventsList,
    Settings
  },
  computed: {
    ...mapGetters("events", { events: "list" }),
    ...mapGetters("accounts", { accounts: "list" }),
    ...mapGetters("networks", { network: "selected" })
  },
  watch: {
    events: function() {
      animateCSS(".events-badge", "heartBeat");
    }
  },
  methods: {
    handleToggleRightPanel(type) {
      if (this.rightPanel === type) {
        this.rightPanel = false;
      } else {
        this.rightPanel = type;
      }
    },
    async requestFunds(generatedAccounts) {
      if (generatedAccounts.length > 0) {
        const item = generatedAccounts[0];

        axios
          .post(process.env.VUE_APP_ISOLATED_FAUCET + "/register-account", {
            address: item.address
          })
          .then(async response => {
            this.$store.dispatch("accounts/AddAccount", {
              address: item.address,
              keystore: item.privateKey,
              type: "keystore"
            });

            if (response.data.success !== false) {
              generatedAccounts.splice(0, 1);

              return await this.requestFunds(generatedAccounts);
            }
          })
          .catch(function(error) {
            console.log(error);
          });
      }
    }
  },
  async created() {
    if (
      this.network.url === process.env.VUE_APP_ISOLATED_URL &&
      this.accounts.length === 0
    ) {
      const generatedAccounts = await generateMultipleZilliqaAccounts(5);

      this.zilliqa = new Zilliqa(this.network.url);

      const chainId = this.network.chainId; // chainId of the developer testnet
      const msgVersion = this.network.msgVersion; // current msgVersion
      this.VERSION = bytes.pack(chainId, msgVersion);

      await this.zilliqa.wallet.addByPrivateKey(
        process.env.VUE_APP_FUNDS_OWNER
      );

      this.requestFunds(generatedAccounts);
    }
  },
  mounted() {
    window.EventBus.$on("close-right-panel", () => {
      this.rightPanel = false;
    });
    window.EventBus.$on("open-account-selector", () => {
      this.rightPanel = "accountSelector";
    });

    window.EventBus.$on("close-account-selector", () => {
      this.rightPanel = false;
    });

    window.EventBus.$on("open-deploy-contract", file => {
      window.EventBus.$emit("clear-components");
      this.deployContract = file;
      this.rightPanel = "deployContract";
    });

    window.EventBus.$on("close-deploy-contract", () => {
      this.deployContract = false;
      this.rightPanel = false;
    });

    window.EventBus.$on("open-call-contract", ({ contractId }) => {
      this.callContract = contractId;
      this.rightPanel = "callContract";
    });

    window.EventBus.$on("open-import-contract", () => {
      this.rightPanel = "importContract";
    });
  }
};
</script>

<style lang="scss">
#app {
  font-family: "Montserrat", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: calc(100% - 48px);
}

.panel-content {
  position: relative;

  .close-button {
    position: absolute;
    right: 1rem;
    top: 1rem;
    width: 20px;
    opacity: 0.5;
    &:hover {
      cursor: pointer;
      opacity: 1;
    }
  }
}

.btn {
  font-size: 0.85rem;
}

.ide {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 2fr 2fr;
  height: 100%;

  &.only2 {
    grid-template-columns: 1fr 4fr;
  }

  .left-panel {
    padding: 1.5rem 0;
    height: 100%;
    border-right: 1px solid #ccc;
  }
  .main-panel {
    height: 100%;
  }
  .right-panel {
    height: 100%;
    border-left: 1px solid #ccc;
    padding-right: 50px;
    max-height: calc(100vh - 60px);
    overflow: scroll;
  }
  .right-sidebar {
    position: absolute;
    right: 0;
    top: 0;
    width: 50px;
    height: 100%;
    border-left: 1px solid #ccc;
    padding: 0.5rem;
    padding-top: 1rem;
    z-index: 99999;
    background-color: #fff;

    .action {
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;

      .badge {
        position: absolute;
        top: 0;
        right: 0;
      }

      img {
        width: 30px;
      }
      &:hover {
        cursor: pointer;
      }
    }
  }
}
</style>
