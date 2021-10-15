<template>
  <div id="app">
    <notifications group="scilla" />
    <tools />
    <top-bar />
    <left-sidebar />
    <div class="ide">
      <div
        id="left-panel"
        class="left-panel"
        :class="{
          open: leftPanel,
          'is-extended': ['deploy'].includes(leftPanel),
        }"
        v-if="leftPanel !== false"
      >
        <files v-if="leftPanel === 'files'" />
        <network v-if="leftPanel === 'network'" />
        <events v-if="leftPanel === 'events'" />
        <settings v-if="leftPanel === 'settings'" />
        <debug v-if="leftPanel === 'debug'" />
        <deploy-contract v-if="leftPanel === 'deploy'" />
      </div>
      <div class="right-panel">
        <div class="main-panel" :class="{ 'has-bottom-panel': bottomPanel }">
          <router-view />
        </div>
        <bottom-panel
          :active="bottomPanel"
          v-on:toggle="handleToggleBottomPanel"
        />
      </div>

      <account-import v-if="rightPanel === 'accountImport'" />
      <add-custom-network v-if="rightPanel === 'addCustomNetwork'" />

      <!-- Contract panels -->
      <contract-import v-if="rightPanel === 'importContract'" />
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
    </div>
  </div>
</template>

<script>
import TopBar from "@/components/TopBar/index";
import LeftSidebar from "@/components/LeftSidebar";

// Panels
import DeployContract from "@/components/Panels/Deploy";
import CallContract from "@/components/Panels/CallContract";
import AccountImport from "@/components/Panels/AccountImport";
import ContractImport from "@/components/Panels/ContractImport";
import Files from "@/components/Panels/Files";
import Network from "@/components/Panels/Network";
import Events from "@/components/Panels/Events";
import Debug from "@/components/Panels/Debug";

import BottomPanel from "@/components/BottomPanel";

import Settings from "@/components/Panels/Settings";
import AddCustomNetwork from "@/components/Panels/AddCustomNetwork";

import Tools from "@/components/Tools";

import { mapGetters } from "vuex";

import { generateMultipleZilliqaAccounts } from "./utils/zilliqa";

import { Zilliqa } from "@zilliqa-js/zilliqa";
import ZilPayMixin from "@/mixins/zilpay";
import TxWatcherMixin from "@/mixins/tx-watcher";

export default {
  name: "App",
  data() {
    return {
      rightPanel: false,
      deployContract: false,
      callContract: false,
      bottomPanel: true,
    };
  },
  mixins: [ZilPayMixin, TxWatcherMixin],
  components: {
    LeftSidebar,
    Files,
    Network,
    TopBar,
    AccountImport,
    DeployContract,
    CallContract,
    ContractImport,
    BottomPanel,
    Events,
    Debug,
    Settings,
    AddCustomNetwork,
    Tools,
  },
  computed: {
    ...mapGetters("accounts", {
      accounts: "list",
      selectedAccount: "selected",
    }),
    ...mapGetters("general", {
      leftPanel: "leftPanel",
    }),
    ...mapGetters("networks", { network: "selected", networksList: "list" }),
    ...mapGetters("contracts", { contracts: "list" }),
    ...mapGetters("transactions", { transactionsWatcher: "watcherList" }),
  },
  methods: {
    handleToggleRightPanel(type) {
      if (this.rightPanel === type) {
        this.rightPanel = false;
      } else {
        this.rightPanel = type;
      }
    },
    handleToggleBottomPanel() {
      this.bottomPanel = !this.bottomPanel;
    },
  },
  async created() {
    // Initialize default network
    if (this.network === undefined) {
      this.$store.dispatch("networks/SelectNetwork", this.networksList[0]);
    }

    if (this.network.url === process.env.VUE_APP_ISOLATED_URL) {
      // Check if contracts are still on network
      const zilliqa = new Zilliqa(process.env.VUE_APP_ISOLATED_URL);

      this.contracts.forEach(async (contract) => {
        const deployed = zilliqa.contracts.at(contract.contractId);

        const state = await deployed.getState();

        if (state === undefined) {
          this.$store.dispatch("contracts/RemoveContract", {
            id: contract.contractId,
          });
        }
      });

      // Generate default accounts on Simulated ENV
      const ACCOUNTS_NUMBER = 5;

      if (this.accounts.length === 0) {
        const generatedAccounts = await generateMultipleZilliqaAccounts(
          ACCOUNTS_NUMBER
        );

        generatedAccounts.map((item) => {
          this.$store.dispatch("accounts/AddAccount", {
            address: item.address,
            keystore: item.privateKey,
            type: "privatekey",
          });
        });
      }
    }
  },
  watch: {
    transactionsWatcher(transactionsList) {
      this.TxWatcher(transactionsList);
    },
  },
  mounted() {
    if (this.transactionsWatcher.length) {
      this.TxWatcher(this.transactionsWatcher);
    }

    window.EventBus.$on("close-right-panel", () => {
      this.rightPanel = false;
    });

    window.EventBus.$on("open-account-import", () => {
      this.rightPanel = "accountImport";
    });

    window.EventBus.$on("open-deploy-contract", (file) => {
      window.EventBus.$emit("clear-components");
      this.deployContract = file;
      this.rightPanel = "deployContract";
    });

    window.EventBus.$on("close-deploy-contract", () => {
      this.deployContract = false;
      this.rightPanel = false;
    });

    window.EventBus.$on("open-deployed-contract", ({ contractId }) => {
      this.callContract = contractId;
      this.$store.dispatch("contracts/SelectContract", { contractId });
      this.rightPanel = "callContract";
    });

    window.EventBus.$on("open-import-contract", () => {
      this.rightPanel = "importContract";
    });

    window.EventBus.$on("open-add-custom-network", () => {
      this.rightPanel = "addCustomNetwork";
    });

    if (
      this.selectedAccount !== undefined &&
      this.selectedAccount.type === "zilpay"
    ) {
      this.getZilPayNetwork()
        .then(() => this.getZilPayAccount())
        .then(() => this.runZilPayObservable());
    }
  },
};
</script>

<style lang="scss">
*::-webkit-scrollbar {
  width: 5px;
}

*::-webkit-scrollbar-track {
  box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.3);
}

*::-webkit-scrollbar-thumb {
  background-color: darkgrey;
  outline: 1px solid slategrey;
}

#app {
  font-family: "Montserrat", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: calc(100% - 48px);
}

.panel-content {
  position: absolute;
  top: 0;
  right: 30px; // 50px RightSidebar - 20px scroll sidebar
  height: 100%;
  width: 500px;
  min-width: 450px;
  min-height: 350px;
  z-index: 98;
  border-left: 1px solid saturate($primary, 10);
  background-color: #fff;

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: saturate($primary, 10);
    padding: 0.5rem calc(0.5rem + 20px) 0.5rem 0.5rem;
    border-top: 1px dashed #ccc;

    .title {
      font-size: 1rem;
      color: #fff;
    }

    .close-button-new {
      cursor: pointer;
      height: 16px;
    }
  }

  .body {
    height: calc(100% - 3rem);
    overflow-y: scroll;
    overflow-x: hidden;
  }
}

input.form-control {
  -webkit-appearance: none !important;
  -moz-appearance: none !important;
  appearance: none !important;
  background-color: #eee !important;
  border: 0 !important;
  border-radius: 0 !important;

  &.alt {
    background-color: #fff !important;
  }
}

.ide {
  position: relative;
  display: flex;
  height: 100%;
  padding-left: 40px;

  .left-panel {
    position: relative;
    height: 100%;
    border-right: 1px solid #ccc;
    overflow: hidden;
    width: 12px;
    display: flex;
    flex-direction: column;

    .panel {
      height: 100%;
      .header {
        background-color: $accent-bg;
        padding: 0 1rem;
        height: 40px;

        .img-button {
          height: 0.85rem;

          &:hover {
            cursor: pointer;
          }
        }
      }

      .panel-body {
        background-color: $accent-bg;
        height: 100%;
        overflow-x: scroll;
      }
    }

    .toggler {
      position: absolute;
      top: 0;
      right: 0;
      width: 12px;
      height: 100%;
      z-index: 100;
      padding-top: 0.5rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      cursor: pointer;
      transition: all 0.2s ease-in-out;
      background-color: #fff;

      * {
        transition: all 0.2s ease-in-out;
      }

      span {
        writing-mode: vertical-lr;
        text-orientation: upright;
        font-size: 10px;
        opacity: 1;
      }

      svg {
        width: 10px;
        height: 10px;
        margin-bottom: 0.5rem;
        transform: rotate(180deg);
        opacity: 1;
      }

      &:hover {
        background-color: lighten($primary, $amount: 40);
      }
    }

    &.open {
      width: 300px;
      min-width: 300px;

      &.is-extended {
        width: 400px;
      }

      .toggler {
        background-color: transparent;
        svg {
          transform: rotate(0deg);
          opacity: 0.35;
        }
        span {
          opacity: 0;
        }

        &:hover {
          background-color: lighten($primary, $amount: 40);

          span,
          svg {
            opacity: 1;
          }
        }
      }
    }
  }

  .right-panel {
    height: 100%;
    flex-grow: 1;

    .main-panel {
      height: calc(
        100% - 1.25rem - 1px - 28px
      ); // full height - bottom panel header - border

      &.has-bottom-panel {
        height: calc(
          100% - 132px
        ); // full height - bottom panel (150px) + editor tabs bar (~28px)
      }
    }
  }
}
</style>
