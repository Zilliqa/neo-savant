<template>
  <div class="cashflow-tags">
    <p class="font-weight-bold">Contract info</p>
    <vue-json-pretty :data="contract_info" :deep="1" />
  </div>
</template>

<script>
import VueJsonPretty from "vue-json-pretty";
export default {
  props: ["contract_info"],
  components: { VueJsonPretty },
};
</script>
