<template>
  <div>
    <label>{{param.vname}} ({{param.type}})</label>
    <input
      type="text"
      class="form-control"
      ref="paramValue"
      :value="param.value"
      @input="updateData"
      v-if="isInput()"
    />
    <ace-editor
      :value="param.value"
      @input="updateData"
      :fontSize="14"
      :showPrintMargin="false"
      :showGutter="false"
      :highlightActiveLine="true"
      ref="aceEditor"
      mode="json"
      lang="json"
      theme="dawn"
      width="100%"
      height="150px"
      :onChange="handleInput"
      :name="`contractInput-${param.name}`"
      :editorProps="{$blockScrolling: true}"
      v-else
    />
  </div>
</template>

<script>
/*eslint-disable */
import brace from "brace"; // eslint-disable-line no-use-before-define
/*eslint-enable */
import { Ace as AceEditor } from "vue2-brace-editor";

import "brace/mode/json";
import "brace/theme/dawn";

export default {
  name: "ContractInput",
  data() {
    return {
      inputs: ["ByStr20", "Uint128", "Uint32", "String"]
    };
  },
  props: ["param"],
  components: { AceEditor },
  methods: {
    isInput() {
      if (this.inputs.indexOf(this.param.type) !== -1) {
        return true;
      }

      return false;
    },
    updateData() {
      this.$emit("input", this.$refs.paramValue.value);
    }
  }
};
</script>