<template>
  <ul class="py-1">
    <tree-item
      class="item"
      :item="treeData"
      :selectedFile="selectedFile"
    ></tree-item>
  </ul>
</template>

<script>
import TreeItem from "./TreeItem";

export default {
  props: {
    treeData: {
      type: Object,
      default: undefined,
    },
    selectedFile: Object,
  },
  components: {
    TreeItem,
  },
};
</script>

<style lang="scss" scoped>
ul {
  list-style: none;
  padding-left: 1rem !important;
}
</style>