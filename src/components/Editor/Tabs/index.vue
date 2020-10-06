<template>
  <div class="tabs-bar">
    <div class="d-flex tabs">
      <tab-item
        v-for="f in openFiles"
        :key="f.id"
        :item="f"
        :selected="selectedFile.id === f.id"
        :changed="changed && changed === f.id"
        v-on:select-file="handleSelectFile(f.id)"
        v-on:close-file="handleCloseFile(f.id)"
      ></tab-item>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import TabItem from "./TabItem";

export default {
  props: ["changed"],
  components: { TabItem },
  computed: {
    ...mapGetters("files", { openFiles: "open", selectedFile: "selected" }),
  },
  methods: {
    handleSelectFile(id) {
      this.$store.dispatch("files/SelectFile", { id });
    },
    handleCloseFile(id) {
      this.$store.dispatch("files/CloseFile", { id });
    },
  },
};
</script>

<style lang="scss" scoped>
.tabs-bar {
  background-color: $accent-bg;
}
</style>
