<template>
  <div class="top-bar d-flex">
    <div class="logo-container mr-5">
      <img src="@/assets/logo.png" />
    </div>
    <div class="menus flex-grow-1 d-flex justify-content-between">
      <div class="main d-flex align-items-center mr-5">
        <router-link to="#" class="mr-3">Scilla Docs</router-link>
        <router-link to="#" class="mr-3">Help</router-link>
        <router-link to="#">Tutorial</router-link>
      </div>
      <div class="details d-flex">
        <account-selector />
        <network-selector />
      </div>
    </div>
  </div>
</template>

<script>
import NetworkSelector from "./NetworkSelector";
import AccountSelector from "./AccountSelector";

export default {
  name: "TopBar",
  components: { NetworkSelector, AccountSelector }
};
</script>

<style lang="scss" scoped>
.top-bar {
  background: $primary;
  position: relative;

  width: 100%;
  height: 48px;

  padding-left: 2rem;
  padding-right: 2rem;

  font-size: 14px;

  a {
    color: #fff;
  }

  .logo-container {
    background-color: #fff;
    width: 80px;
    align-items: center;
    justify-content: center;
    display: flex;

    img {
      max-height: 48px;
      object-fit: contain;
    }
  }
}
</style>