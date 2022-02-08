<template>
  <div class="input-contract">
    <label>
      <div class="type">
        <input-popover :type="type"></input-popover>
      </div>
    </label>
    <div v-if="curTransition === undefined">
      <div>Select a transition to submit</div>
      <br/>    
      <div
          class="col-12 mb-4"
          v-for="transition in multiSigTransitions"
          :key="transition.vname"
      >
        <button 
        class="btn btn-light text-primary text-small mr-2"
        @click="setTransition(transition)"
        >
          <small>{{ transition.vname }}</small>
        </button>
      </div>
    </div>
    <div v-if="curTransition !== undefined">
      <div
      class="col-12 mb-4"
      v-for="param in curTransition.params"
      :key="param.vname"
      >
        
        <label>
          <div class="name">{{ param.vname }}</div>
          <div class="type">
            <input-popover :type="param.type"></input-popover>
          </div>
        </label>
        {{ param.type }}
        <input
          type="text"
          class="form-control"
          :class="{ 'has-errors': error }"
        />
      </div>
    </div>
</div>
</template>

<script>
import InputPopover from "./InputPopover";

import "brace/mode/json";
import "brace/theme/dawn";

import { getParamType } from "@/utils/validation.js";

export default {
  name: "ContractInput",
  data() {
    return {
      curTransition: undefined,
    };
  },
  computed: {
    inputType() {
      return getParamType({ type: this.type });
    },
  },
  props: ["vname", "type", "pvalue", "error", "multiSigTransitions"],
  components: { InputPopover },
  methods: {
    setTransition(transition) {
      this.curTransition = transition;
    },
    updateData(payload) {
      let newval = this.pvalue;

      if (payload.target === undefined) {
        newval = payload;
      } else {
        newval = payload.target.value;
      }

      this.$emit("input", newval);
    },
  },
};
</script>

<style lang="scss" scoped>
.input-contract {
  label {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .name {
      color: rgb(143, 142, 142);
      font-weight: bold;
    }

    .type {
      font-size: 12px;
    }
  }

  input {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background-color: #eee;
    border: 0;
    border-radius: 0;
  }
}

.has-errors {
  border-color: #dc3545 !important;
  background-color: transparentize($color: #dc3545, $amount: 0.5) !important;
}
.ace-has-errors .ace_content {
  border-color: #dc3545 !important;
  background-color: transparentize($color: #dc3545, $amount: 0.5) !important;
}
</style>