<template>
  <div class="events-list panel-content p-4">
    <img src="@/assets/close.svg" class="close-button" @click="handleClose" />
    <div class="mb-4 event-item" v-for="(event,index) in events" :key="index">
      <div class="remove-button" @click="handleRemove(index)">
        <img src="@/assets/rubbish.svg" />
      </div>
      <p class="header pb-2">
        {{ event.address }}
        <br />
        <span class="font-weight-bold">{{ event._eventname }}</span>
      </p>
      <vue-json-pretty :data="event" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import VueJsonPretty from "vue-json-pretty";

export default {
  components: { VueJsonPretty },
  data() {
    return {};
  },
  computed: {
    ...mapGetters("events", { events: "list" })
  },
  methods: {
    handleClose() {
      window.EventBus.$emit("close-right-panel");
    },
    handleRemove(index) {
      this.$store.dispatch("events/RemoveEvent", { index }).then(() => {
        this.$notify({
          group: "scilla",
          type: "success",
          position: "bottom right",
          title: "Events",
          text: "Event removed"
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.events-list {
  position: relative;

  .event-item {
    padding: 0.5rem;
    border: 1px dashed #ccc;
    position: relative;

    .header {
      border-bottom: 1px dashed #ccc;
    }

    .remove-button {
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      opacity: 0.5;
      width: 20px;

      &:hover {
        cursor: pointer;
        opacity: 1;
      }
    }
  }
}
</style>