<template>
  <div class="network-selector d-flex">
    <div class="selected-network d-flex align-items-center">
      <img src="@/assets/server.svg" height="24px" class="mr-2" />
      {{selected.name}}
    </div>

    <div class="networks-list flex-column">
      <div
        class="item"
        v-for="network in list"
        :key="network.name"
        @click="handleSelect(network)"
      >{{network.name}}</div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters("networks", ["selected", "list"])
  },
  methods: {
    handleSelect(network) {
      this.$store.dispatch("networks/SelectNetwork", network);
    }
  }
};
</script>

<style lang="scss" scoped>
.network-selector {
  padding: 0 0.5rem;
  transition: all 0.2s ease;
  &:hover {
    cursor: pointer;
    background-color: lighten($primary, 10);
  }

  color: #000;
  position: relative;
  .networks-list {
    display: none;
  }

  &:hover {
    .networks-list {
      position: absolute;
      left: 0;
      top: 48px;
      z-index: 9999;
      display: flex;
      background-color: lighten($primary, 20);

      .item {
        padding: 0.5rem;

        &:hover {
          background-color: $primary;
        }
      }
    }
  }
}
</style>