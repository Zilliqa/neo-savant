<template>
  <div class="panel events-list">
    <div
      class="header text-primary d-flex justify-content-between align-items-center"
    >
      EVENTS
      <img
        src="@/assets/dustbin.svg"
        @click="handleClearEvents"
        class="img-button"
      />
    </div>
    <div class="panel-body p-3">
      <event-item
        v-for="(event, index) in events"
        :event="event"
        :key="index"
        v-on:remove-event="handleRemove(index)"
      ></event-item>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import EventItem from "./EventItem";

export default {
  components: { EventItem },
  data() {
    return {};
  },
  computed: {
    ...mapGetters("events", { events: "list" }),
  },
  methods: {
    handleClearEvents() {
      this.$store.dispatch("events/ClearEvents").then(() => {
        this.$notify({
          group: "scilla",
          type: "success",
          position: "bottom right",
          title: "Events",
          text: "Events cleared",
        });
      });
    },
    handleRemove(index) {
      this.$store.dispatch("events/RemoveEvent", { index }).then(() => {
        this.$notify({
          group: "scilla",
          type: "success",
          position: "bottom right",
          title: "Events",
          text: "Event removed",
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.clear-events {
  cursor: pointer;
}
.events-list {
  position: relative;
}
</style>
