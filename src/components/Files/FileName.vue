<template>
  <div
    class="file-name"
    :class="{'selected' : selected}"
    @click="$emit('select-file', file.id)"
  >
    <span class="editable" @dblclick="edit = true" v-if="!edit">{{ file.name }}</span>
    <input v-if="edit" v-model="file.name" v-on:blur="handleRename" @keyup.enter="handleRename" />
    <span class="extension">.scilla</span>
  </div>
</template>

<script>
export default {
  data() {
    return {
      edit: false
    };
  },
  props: ["file", "selected"],
  methods: {
    handleRename() {
      this.edit = false;

      this.$store
        .dispatch("files/RenameFile", {
          id: this.file.id,
          name: this.file.name
        })
        .then(() => {
          this.$notify({
            group: "scilla",
            type: "success",
            position: "bottom right",
            title: "Files",
            text: "File has been renamed"
          });
        });
    }
  }
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
</style>