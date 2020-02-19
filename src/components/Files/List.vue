<template>
  <div class="files-list mb-4">
    <div class="header d-flex align-items-center mb-2">
      FILES
      <img src="@/assets/file-add.svg" class="img-button ml-3" @click="addFile" />
    </div>
    <div class="list">
      <div
        class="list-item py-1"
        :class="{'selected' : (selected && selected.id === file.id)}"
        v-for="file in list"
        :key="file.id"
        @contextmenu.prevent="$refs.menu.open"
      >
        <file-name
          :file="file"
          v-on:select-file="handleSelect"
          :selected="selected && selected.id === file.id"
        />
      </div>
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
  </div>
</template>

<script>
import { VueContext } from "vue-context";
import { mapGetters } from "vuex";
import FileName from "./FileName";

export default {
  name: "FilesList",
  data() {
    return {};
  },
  components: { FileName, VueContext },
  computed: {
    ...mapGetters("files", ["selected", "list"])
  },
  methods: {
    addFile() {
      this.$store.dispatch("files/CreateFile");
    },
    handleSelect(id) {
      this.$store.dispatch("files/SelectFile", { id });
    }
  }
};
</script>

<style lang="scss" scoped>
.header {
  background-color: #fff;
  font-weight: 700;
  text-transform: uppercase;
  color: #ea8b0c;
  font-family: "Montserrat";
  font-size: 1rem;
  padding-left: 1rem;
}

.files-list {
  .list-item {
    padding-left: 1rem;

    &.selected {
      background-color: #ea8a0c44;
    }
  }
}
.context-menu {
  li {
    a {
      font-size: 14px;
    }
  }
}
.img-button {
  height: 20px;

  &:hover {
    cursor: pointer;
  }
}
</style>