<template>
  <div id="app">
    <notifications group="scilla" />
    <tools />
    <top-bar />
    <div class="ide">
      <div id="left-panel" class="left-panel">
        <files-list />
        <contracts-list />
      </div>
      <div class="right-panel">
        <div class="main-panel">
          <router-view />
        </div>
        <div class="bottom-panel d-none"></div>
      </div>
      <deploy-contract
        v-if="rightPanel === 'deployContract'"
        :file="this.deployContract"
        :key="this.deployContract.id"
      />
      <account-selector v-if="rightPanel === 'accountSelector'" />
      <console v-if="rightPanel === 'console'" />
      <events-list v-if="rightPanel === 'events'" />
      <settings v-if="rightPanel === 'settings'" />
      <call-contract
        v-if="rightPanel === 'callContract'"
        :contractId="this.callContract"
        :key="this.callContract"
      />
      <import-contract v-if="rightPanel === 'importContract'" />
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
import DeployContract from "@/components/Panels/DeployContract";
import CallContract from "@/components/CallContract";
import ImportContract from "@/components/ImportContract";
import EventsList from "@/components/EventsList";
import Settings from "@/components/Settings";

import Tools from "@/components/Tools";

import { mapGetters } from "vuex";

import { generateMultipleZilliqaAccounts } from "./utils/zilliqa";
import { animateCSS } from "./utils/ui";

import { Zilliqa } from "@zilliqa-js/zilliqa";

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
    Settings,
    Tools
  },
  computed: {
    ...mapGetters("events", { events: "list" }),
    ...mapGetters("accounts", { accounts: "list" }),
    ...mapGetters("networks", { network: "selected", networksList: "list" }),
    ...mapGetters("contracts", { contracts: "list" })
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
    }
  },
  async created() {
    // Initialize default network
    if (this.network === undefined) {
      this.$store.dispatch("networks/SelectNetwork", this.networksList[0]);
    }

    if (this.network.url === process.env.VUE_APP_ISOLATED_URL) {
      // Check if contracts are still on network
      const zilliqa = new Zilliqa(process.env.VUE_APP_ISOLATED_URL);

      this.contracts.forEach(async contract => {
        const deployed = zilliqa.contracts.at(contract.contractId);

        const state = await deployed.getState();

        if (state === undefined) {
          this.$store.dispatch("contracts/RemoveContract", {
            id: contract.contractId
          });
        }
      });

      // Generate default accounts on Simulated ENV
      const ACCOUNTS_NUMBER = 5;

      if (this.accounts.length === 0) {
        const generatedAccounts = await generateMultipleZilliqaAccounts(
          ACCOUNTS_NUMBER
        );

        generatedAccounts.map(item => {
          this.$store.dispatch("accounts/AddAccount", {
            address: item.address,
            keystore: item.privateKey,
            type: "keystore"
          });
        });
      }
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

.btn {
  font-size: 0.85rem;
  transition: all 0.2s ease-in-out;
  i.fas {
    transition: all 0.2s ease-in-out;
    margin-left: 0.2rem;
  }

  &:hover {
    i.fas {
      transition: all 0.2s ease-in-out;
      margin-left: 0.5rem;
    }
  }

  &.btn-primary {
    background-color: $primary;
    border-color: $primary;

    &:hover {
      background-color: lighten($color: $primary, $amount: 8);
      border-color: lighten($color: $primary, $amount: 8);
    }
  }
}

.ide {
  position: relative;
  display: flex;
  height: 100%;

  &.only2 {
    grid-template-columns: 1fr 4fr;
  }

  .left-panel {
    padding: 1.5rem 0;
    height: 100%;
    border-right: 1px solid #ccc;
    width: 300px;
  }

  .main-panel {
    height: 100%;
  }

  .right-panel {
    height: 100%;
    flex-grow: 1;
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
    z-index: 99;
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
.tooltip {
  display: block !important;
  z-index: 10000;
}

.tooltip .tooltip-inner {
  background: black;
  color: white;
  border-radius: 16px;
  padding: 5px 10px 4px;
}

.tooltip .tooltip-arrow {
  width: 0;
  height: 0;
  border-style: solid;
  position: absolute;
  margin: 5px;
  border-color: black;
  z-index: 1;
}

.tooltip[x-placement^="top"] {
  margin-bottom: 5px;
}

.tooltip[x-placement^="top"] .tooltip-arrow {
  border-width: 5px 5px 0 5px;
  border-left-color: transparent !important;
  border-right-color: transparent !important;
  border-bottom-color: transparent !important;
  bottom: -5px;
  left: calc(50% - 5px);
  margin-top: 0;
  margin-bottom: 0;
}

.tooltip[x-placement^="bottom"] {
  margin-top: 5px;
}

.tooltip[x-placement^="bottom"] .tooltip-arrow {
  border-width: 0 5px 5px 5px;
  border-left-color: transparent !important;
  border-right-color: transparent !important;
  border-top-color: transparent !important;
  top: -5px;
  left: calc(50% - 5px);
  margin-top: 0;
  margin-bottom: 0;
}

.tooltip[x-placement^="right"] {
  margin-left: 5px;
}

.tooltip[x-placement^="right"] .tooltip-arrow {
  border-width: 5px 5px 5px 0;
  border-left-color: transparent !important;
  border-top-color: transparent !important;
  border-bottom-color: transparent !important;
  left: -5px;
  top: calc(50% - 5px);
  margin-left: 0;
  margin-right: 0;
}

.tooltip[x-placement^="left"] {
  margin-right: 5px;
}

.tooltip[x-placement^="left"] .tooltip-arrow {
  border-width: 5px 0 5px 5px;
  border-top-color: transparent !important;
  border-right-color: transparent !important;
  border-bottom-color: transparent !important;
  right: -5px;
  top: calc(50% - 5px);
  margin-left: 0;
  margin-right: 0;
}

.tooltip.popover .popover-inner {
  background: #f9f9f9;
  color: black;
  padding: 24px;
  border-radius: 5px;
  box-shadow: 0 5px 30px rgba(black, 0.1);
}

.tooltip.popover .popover-arrow {
  border-color: #f9f9f9;
}

.tooltip[aria-hidden="true"] {
  visibility: hidden;
  opacity: 0;
  transition: opacity 0.15s, visibility 0.15s;
}

.tooltip[aria-hidden="false"] {
  visibility: visible;
  opacity: 1;
  transition: opacity 0.15s;
}

.tooltip {
  &.popover {
    $color: #f9f9f9;
    width: 450px;
    max-width: 450px;

    .popover-inner {
      background: $color;
      color: black;
      padding: 24px;
      border-radius: 5px;
      box-shadow: 0 5px 30px rgba(black, 0.1);
      max-width: 500px;
      text-align: left;
    }

    .popover-arrow {
      border-color: $color;
    }
  }

  .tooltip-arrow {
    z-index: 1;
  }
}
.tooltip-arrow {
  z-index: 1;
}
</style>
