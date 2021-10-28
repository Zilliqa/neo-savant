<template>
  <div class="panel files-list">
    <div
      class="
        header
        text-primary
        d-flex
        justify-content-between
        align-items-center
      "
    >
      FILES
      <img src="@/assets/plus.svg" class="img-button" />
    </div>
    <div class="list panel-body">
      <tree-view
        :treeData="{ name: 'Files List', children: list, root: true }"
        :selectedFile="selected"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import TreeView from "./TreeView";

export default {
  name: "FilesList",
  components: { TreeView },
  computed: {
    ...mapGetters("files", ["selected", "list"]),
  },
  methods: {
    addFile() {
      this.$store.dispatch("files/CreateFile").then((id) => {
        this.$store.dispatch("files/SelectFile", { id });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.files-list {
  .list-item {
    padding-left: 1rem;

    &.selected {
      background-color: #ea8a0c44;
    }
  }
}
</style>
