<template>
  <div class="cashflow-tags">
    <p class="font-weight-bold">Cashflow Tags</p>
    <vue-json-pretty :data="tags" :deep="1" />
  </div>
</template>

<script>
import VueJsonPretty from "vue-json-pretty";
export default {
  props: ["tags"],
  components: { VueJsonPretty },
};
</script>
