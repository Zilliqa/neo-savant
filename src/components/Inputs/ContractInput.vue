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
      mode="text"
      lang="json"
      theme="dawn"
      width="100%"
      height="150px"
      :name="`contractInput-${param.vname}`"
      :editorProps="{$blockScrolling: true}"
      v-else
    />
    <div class="alert alert-warning" v-if="error">{{error}}</div>
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
      error: false
    };
  },
  props: ["param"],
  components: { AceEditor },
  methods: {
    isInput() {
      const regex = /(ByStr\d{1,}|Uint\d{1,}|Int\d{1,}|String|BNum)/g;
      const firstWord = this.param.type.replace(/ .*/, "");

      if (firstWord.match(regex) !== null) {
        return true;
      }

      return false;
    },
    updateData(payload) {
      if (payload.target === undefined) {
        try {
          this.param.value = JSON.parse(payload);
        } catch (e) {
          this.param.value = payload.toString();
        }
      } else {
        this.param.value = payload.target.value;
      }

      this.$emit("input", this.param.value);
    }
  }
};
</script>