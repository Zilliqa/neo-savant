<template>
  <div class="account-selector panel-content">
    <div class="header">
      <div class="title">Sign Transaction</div>
      <img src="@/assets/close-color.svg" @click="handleClose" class="close-button-new" />
    </div>

    <div class="body p-4"></div>
  </div>
</template>

<script>
export default {
  methods: {
    handleClose() {
      window.EventBus.$emit("close-right-panel");
    }
  }
};
</script>