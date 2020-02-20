<template>
  <div class="settings p-4">
    <div class="ide-settings">
      <h4>IDE Settings</h4>

      <div class="form-input">
        <label>Font size</label>
        <input class="form-control" type="number" :value="editor.fontSize" @change="updateFontSize" />
      </div>
    </div>

    <div class="simulated-env-settings">
      <h4 class="mt-4">Simulated Env Settings</h4>

      <div class="form-input">
        <label>Faucet contract</label>
        <input class="form-control" type="text" v-model="network.faucet" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  components: {},
  data() {
    return {
      network: {
        faucet: ""
      }
    };
  },
  computed: {
    ...mapGetters("general", { editor: "editor" })
  },
  methods: {
    async updateFontSize(ev) {
      //window.EventBus.$emit("change-editor-fontSize", parseInt(ev.target.value));
      this.$store.dispatch("general/ChangeFontSize", {
        fontSize: parseInt(ev.target.value)
      });
    }
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