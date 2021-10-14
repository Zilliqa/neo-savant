<template>
  <div class="cashflow-tags">
    <p class="font-weight-bold">Cashflow Tags</p>
    <MonacoEditor
      class="editor mb-4"
      :value="JSON.stringify(tags, null, 2)"
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
  props: ["tags"],
  components: { MonacoEditor },
};
</script>

<style lang="scss" scoped>
.editor {
  width: 100%;
  height: 300px;
}
</style>