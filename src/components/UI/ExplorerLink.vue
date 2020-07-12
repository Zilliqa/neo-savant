<template>
  <a :href="link" class="explorer-link">
    <span class="txid" v-if="txid">{{ txid }}</span>
    <span v-else>Network Explorer</span>
  </a>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "ExplorerLink",
  props: ["txid"],
  computed: {
    ...mapGetters("networks", { selectedNetwork: "selected" }),
    link() {
      let baseLink = process.env.VUE_APP_EXPLORER_URL;
      let networkLink = "?network=" + this.selectedNetwork.url;
      let txLink = "";

      if (this.txid) {
        txLink = `tx/${this.txid}`;
      }

      return baseLink + txLink + networkLink;
    }
  }
};
</script>