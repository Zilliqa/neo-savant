<template>
  <div class="left-sidebar">
    <div class="logo-container mr-5">
      <img src="@/assets/logo.png" />
    </div>
    <div
      class="action"
      :class="{ 'is-open': leftPanel === 'files' }"
      @click="handleSwitchPanel('files')"
    >
      <img src="@/assets/files.svg" />
    </div>
    <div
      class="action"
      :class="{ 'is-open': leftPanel === 'debug' }"
      @click="handleSwitchPanel('debug')"
    >
      <img src="@/assets/clipboard.svg" />
    </div>
    <div
      class="action"
      :class="{ 'is-open': leftPanel === 'deploy' }"
      @click="handleSwitchPanel('deploy')"
    >
      <img src="@/assets/play-button.svg" />
    </div>
    <div
      class="action"
      :class="{ 'is-open': leftPanel === 'network' }"
      @click="handleSwitchPanel('network')"
    >
      <img src="@/assets/contracts.svg" />
    </div>
    <events-badge
      :class="{ 'is-open': leftPanel === 'events' }"
      v-on:switch-panel="handleSwitchPanel('events')"
    />

    <div
      class="action"
      :class="{ 'is-open': leftPanel === 'settings' }"
      @click="handleSwitchPanel('settings')"
    >
      <img src="@/assets/industry.svg" />
    </div>
  </div>
</template>

<script>
import EventsBadge from "./EventsBadge";
import { mapGetters } from "vuex";

export default {
  components: { EventsBadge },
  computed: {
    ...mapGetters("general", ["leftPanel"]),
  },
  methods: {
    handleSwitchPanel(panel) {
      this.$store.dispatch("general/OpenLeftPanel", panel);
    },
  },
};
</script>

<style lang="scss">
.left-sidebar {
  position: absolute;
  left: 0;
  top: 0;
  width: 40px;
  height: 100%;
  //border-right: 1px solid #ddd;
  z-index: 99;
  background-color: #fff;

  .logo-container {
    background-color: #fff;
    width: 100%;
    height: 48px;
    align-items: center;
    justify-content: center;
    display: flex;

    img {
      max-width: 90%;
      object-fit: contain;
    }
  }

  .action {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    height: 40px;

    &:hover {
      background-color: $accent-bg;
    }

    &.is-open {
      background-color: $accent-bg;
    }

    .badge {
      position: absolute;
      top: 0;
      right: 0;
      font-size: 60%;
    }

    img {
      width: 20px;
    }
    &:hover {
      cursor: pointer;
    }
  }
}
</style>
