<template>
  <div class="action events-badge" @click="$emit('switch-panel')">
    <img src="@/assets/notifications.svg" />

    <span class="badge badge-danger" v-if="events.length">{{
      events.length
    }}</span>
  </div>
</template>

<script>
import { animateCSS } from "@/utils/ui";
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters("events", { events: "list" }),
  },
  watch: {
    events: function() {
      animateCSS(".events-badge", "heartBeat");
    },
  },
};
</script>
