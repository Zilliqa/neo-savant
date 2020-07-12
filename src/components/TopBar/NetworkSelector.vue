<template>
  <v-popover
    offset="16"
    trigger="hover"
    placement="top"
    class="network-selector d-flex"
    v-if="account && account.type === 'zilpay'"
  >
    <!-- This will be the popover target (for the events and position) -->
    <div class="tooltip-target b3 selected-network d-flex align-items-center">
      <img src="@/assets/server.svg" height="24px" class="mr-2" />
      {{selected.name}}
    </div>
    <template
      slot="popover"
    >The account currently selected is managed by external extension ZilPay. You have to change the network from the extension itself.</template>
  </v-popover>
  <div class="network-selector not-zilpay d-flex" v-else>
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
    ...mapGetters("networks", ["selected", "list"]),
    ...mapGetters("accounts", { account: "selected" })
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
  .trigger {
    display: flex !important;
  }

  color: #000;
  position: relative;
  .networks-list {
    display: none;
  }

  &.not-zilpay:hover {
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