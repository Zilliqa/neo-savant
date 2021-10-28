<template>
  <li>
    <div
      :class="{ bold: isFolder }"
      class="d-flex"
      @click="toggle"
      @dblclick="makeFolder"
      v-if="!item.root || item.root !== true"
    >
      <div v-if="isFolder">
        <i class="fas fa-chevron-right" v-if="!isOpen"></i>
        <i class="fas fa-chevron-down" v-else></i>
      </div>
      <file-name
        :file="item"
        v-on:select-file="handleSelect"
        :selected="selectedFile && selectedFile.id === item.id"
      />
    </div>
    <ul v-show="isOpen" v-if="isFolder">
      <tree-item
        class="item"
        v-for="(child, index) in item.children"
        :key="index"
        :item="child"
        @make-folder="$emit('make-folder', $event)"
        @add-item="$emit('add-item', $event)"
      ></tree-item>
    </ul>
  </li>
</template>

<script>
import FileName from "./FileName";
export default {
  name: "TreeItem",
  props: {
    item: Object,
    selectedFile: Object,
  },
  data: function () {
    return {
      isOpen: true,
    };
  },
  components: {
    FileName,
  },
  computed: {
    isFolder: function () {
      return this.item.children && this.item.children.length;
    },
  },
  methods: {
    handleSelect(id) {
      this.$store.dispatch("files/SelectFile", { id });
    },
    toggle: function () {
      if (this.isFolder) {
        this.isOpen = !this.isOpen;
      }
    },
    makeFolder: function () {
      if (!this.isFolder) {
        this.$emit("make-folder", this.item);
        this.isOpen = true;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.file-name {
  font-size: 0.85rem;
  color: #000;

  &.selected {
    color: $primary;
  }

  &:hover {
    cursor: pointer;
    color: $primary;
  }
}
ul {
  list-style: none;
  padding-left: 0.5rem;

  li {
    list-style: none;
  }
}
</style>