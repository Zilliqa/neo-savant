<template>
  <div
    class="file-name"
    :class="{'selected' : selected}"
    @click="$emit('select-file', file.id)"
    @contextmenu.prevent="$refs.menu.open"
  >
    <span class="editable" @dblclick="edit = true" v-if="!edit">{{ file.name }}</span>
    <input v-if="edit" v-model="file.name" v-on:blur="handleRename" @keyup.enter="handleRename" />
    <span class="extension">.scilla</span>

    <vue-context class="context-menu" ref="menu">
      <li>
        <a href="#" @click.prevent="edit = true">Rename</a>
      </li>
      <li>
        <a href="#" @click.prevent="onClick($event.target.innerText)">Duplicate</a>
      </li>
      <li>
        <a href="#" @click.prevent="onClick($event.target.innerText)">Delete</a>
      </li>
    </vue-context>
  </div>
</template>

<script>
import { VueContext } from "vue-context";

export default {
  data() {
    return {
      edit: false
    };
  },
  props: ["file", "selected"],
  components: { VueContext },
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

.context-menu {
  li {
    a {
      font-size: 14px;
    }
  }
}
</style>