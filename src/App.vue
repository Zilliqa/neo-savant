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

        <div class="action" @click="handleToggleRightPanel('events')">
          <img src="@/assets/notifications.svg" />
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

export default {
  name: "App",
  data() {
    return {
      rightPanel: "console",
      deployContract: false,
      callContract: false
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
    ImportContract
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
  mounted() {
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
    padding: 1.5rem 2rem;
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
