<template>
  <div class="network-selector">
    <label>
      <span class="name">Network</span>
    </label>
    <div class="d-flex">
      <div class="select-container mr-2">
        <select class="form-control alt" @change="handleSelect">
          <option
            v-for="network in list"
            :key="network.id"
            :value="network.name"
            :selected="network.name === selected.name"
          >
            {{ network.name }}
            <span v-if="network.url">({{ network.url }})</span>
          </option>
        </select>
      </div>
      <button class="btn btn-outline-secondary" @click="handleAddNetwork">
        +
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters("networks", { list: "list", selected: "selected" }),
  },
  methods: {
    handleSelect(ev) {
      const network = this.list.find((i) => i.name === ev.target.value);

      this.$store.dispatch("networks/SelectNetwork", network);
    },
    handleAddNetwork() {
      window.EventBus.$emit("open-add-custom-network");
    },
  },
};
</script>
