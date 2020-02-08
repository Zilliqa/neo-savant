<template>
  <div>
    <label>{{param.vname}} ({{param.type}})</label>
    <input
      type="text"
      v-model="param.value"
      class="form-control"
      ref="paramValue"
      @input="updateData"
      v-if="isInput()"
    />
    <ace-editor
      v-model="param.value"
      :onChange="updateData"
      :fontSize="14"
      :showPrintMargin="false"
      :showGutter="false"
      :highlightActiveLine="true"
      ref="paramValue"
      mode="json"
      lang="json"
      theme="dawn"
      width="100%"
      height="150px"
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
      inputs: ["ByStr20", "Uint128", "Uint32", "String", "BNum"]
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
    updateData(payload) {
      if (payload) {
        this.param.value = JSON.parse(payload);
      }

      this.$emit("input", this.param.value);
    }
  }
};
</script>