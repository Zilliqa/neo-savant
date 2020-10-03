<template>
  <div class="panel files-list">
    <div
      class="header text-primary d-flex justify-content-between align-items-center"
    >
      FILES
      <img src="@/assets/plus.svg" class="img-button" />
    </div>
    <div class="list panel-body">
      <div
        class="list-item py-1"
        :class="{ selected: selected && selected.id === file.id }"
        v-for="file in list"
        :key="file.id"
      >
        <file-name
          :file="file"
          v-on:select-file="handleSelect"
          :selected="selected && selected.id === file.id"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import FileName from "./FileName";

export default {
  name: "FilesList",
  data() {
    return {};
  },
  components: { FileName },
  computed: {
    ...mapGetters("files", ["selected", "list"]),
  },
  methods: {
    addFile() {
      this.$store.dispatch("files/CreateFile").then((id) => {
        this.$store.dispatch("files/SelectFile", { id });
      });
    },
    handleSelect(id) {
      this.$store.dispatch("files/SelectFile", { id });
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
