<template>
  <div class="events-list p-4">
    <div class="mb-4 event-item" v-for="(event,index) in events" :key="index">
      <p class="header pb-2">{{ event.address }} <br/><span class="font-weight-bold">{{ event._eventname }}</span></p>
        <vue-json-pretty :data="event" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import VueJsonPretty from "vue-json-pretty";

export default {
  components: {VueJsonPretty},
  data() {
    return {};
  },
  computed: {
    ...mapGetters("events", { events: "list" })
  }
};
</script>

<style lang="scss" scoped>
.event-item {
  padding:0.5rem;
  border:1px dashed #ccc;

  .header {
    border-bottom: 1px dashed #ccc;
  }
}
</style>