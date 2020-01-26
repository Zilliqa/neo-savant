<template>
  <div id="app">
    <notifications group="scilla" />
    <top-bar />
    <div class="ide">
      <div id="left-panel" class="left-panel">
        <files-list />
        <contracts-list />
      </div>
      <div class="main-panel">
        <router-view />
      </div>
      <div class="right-panel">
        <account-selector v-if="accountSelector" />
        <console v-if="console" />
        <deploy-contract v-if="deployContract" :file="this.deployContract" />
        <call-contract v-if="callContract" :contractId="this.callContract" />
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

export default {
  name: "App",
  data() {
    return {
      accountSelector: false,
      deployContract: false,
      callContract: false,
      console: true
    };
  },
  components: {
    FilesList,
    ContractsList,
    TopBar,
    AccountSelector,
    Console,
    DeployContract,
    CallContract
  },
  mounted() {
    window.EventBus.$on("open-account-selector", () => {
      this.accountSelector = true;
      this.console = false;
      this.deployContract = false;
      this.callContract = false;
    });

    window.EventBus.$on("close-account-selector", () => {
      this.accountSelector = false;
      this.console = true;
      this.deployContract = false;
    });

    window.EventBus.$on("open-deploy-contract", file => {
      this.console = false;
      this.accountSelector = false;
      this.deployContract = file;
      this.callContract = false;
    });

    window.EventBus.$on("close-deploy-contract", () => {
      this.accountSelector = false;
      this.console = true;
      this.deployContract = false;
    });

    window.EventBus.$on("open-call-contract", ({ contractId }) => {
      this.accountSelector = false;
      this.callContract = contractId;
      this.console = false;
      this.deployContract = false;
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
  display: grid;
  grid-template-columns: 1fr 2fr 2fr;
  height: 100%;

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
  }
}
</style>
