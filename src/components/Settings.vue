<template>
  <div class="settings p-4">
    <div class="ide-settings">
      <h4>IDE Settings</h4>

      <div class="form-input">
        <label>Font size</label>
        <input class="form-control" type="number" v-model="fontSize" />
      </div>
    </div>

    <div class="simulated-env-settings">
      <h4 class="mt-4">Simulated Env Settings</h4>

      <div class="form-input">
        <label>Faucet contract</label>
        <input class="form-control" type="text" v-model="ide.faucet" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      fontSize: 14,
      ide: {
        faucet: ''
      }
    };
  },
  mounted() {
    /* window.EventBus.$on("console-log", ({ message, type }) => {
      // console.log(message, type);
      //this.$refs.console.$_executeCommand('help');
    }); */
  }
};
</script>

<style lang="scss" >
</style>