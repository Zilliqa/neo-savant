<template>
  <div class="tabs-bar">
    <ul class="nav nav-tabs">
      <li class="nav-item" v-for="f in openFiles" :key="f.id">
        <a
          class="nav-link d-flex"
          :class="{'active': selectedFile.id === f.id}"
        >
          <div class="action mr-1">
            <i class="fas fa-exclamation-triangle text-warning" v-if="changed && changed === f.id"></i>
            <i class="fas fa-times" v-else @click.prevent="handleCloseFile(f.id)"></i>
          </div>
          <div class="file-name" @click="handleSelectFile(f.id)">{{ f.name }}</div>
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  props: ["changed"],
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
  .nav-tabs {
    .nav-item {
      .nav-link {
        padding: 0.1rem 0.5rem;
        font-size: 14px;
        cursor: pointer;

        background-color: lighten(#ccc, 15);

        &.active {
          background-color: #fff;
        }

        .action:hover {
          color: $primary;
        }
      }
    }
  }
}
</style>