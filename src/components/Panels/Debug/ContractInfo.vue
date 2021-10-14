<template>
  <div class="cashflow-tags">
    <p class="font-weight-bold">Contract info</p>
    <MonacoEditor
      class="editor mb-4"
      :value="JSON.stringify(contract_info, null, 2)"
      :options="monacoOptions"
      language="json"
    />
  </div>
</template>

<script>
import MonacoEditor from "vue-monaco";
export default {
  data() {
    return {
      monacoOptions: {
        minimap: {
          enabled: false,
        },
        lineNumbers: false,
        readOnly: true,
      },
    };
  },
  props: ["contract_info"],
  components: { MonacoEditor },
};
</script>


<style lang="scss" scoped>
.editor {
  width: 100%;
  height: 350px;
}
</style>