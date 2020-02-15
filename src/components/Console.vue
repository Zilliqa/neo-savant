<template>
  <div>
    <vue-command
      :yargs-options="{ alias: { color: ['colour'] } }"
      :commands="commands"
      ref="console"
      title="Savant IDE Console"
      :white-theme="true"
      :hide-bar="true"
      prompt="$"
    />
    <div class="checker-results">
      <div class="warnings" v-if="checkerWarnings">
        <div class="header bg-warning">{{checkerWarnings.length}} Checker Warnings:</div>
        <div class="content">
          <ul>
            <li v-for="(warning,index) in checkerWarnings" :key="index">
              <span class="badge badge-warning">{{warning.row + 1}}, {{warning.column}}</span>
              {{warning.text}}
            </li>
          </ul>
        </div>
      </div>
      <div class="errors" v-if="checkerErrors">
        <div class="header bg-danger text-white">{{ checkerErrors.length }} Checker Errors:</div>
        <div class="content">
          <ul>
            <li v-for="(error,index) in checkerErrors" :key="index">
              <span class="badge badge-danger">{{error.row + 1}}, {{error.column}}</span>
              {{error.text}}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VueCommand from "vue-command";
import "vue-command/dist/vue-command.css";

const { toBech32Address, fromBech32Address } = require("@zilliqa-js/crypto");

export default {
  components: {
    VueCommand
  },
  data() {
    return {
      checkerErrors: undefined,
      checkerWarnings: undefined,
      commands: {
        // [0] -> command > [1] -> arg
        log: ({ _ }) => {
          return _[1];
        },
        check: () => {
          window.EventBus.$emit("console-run-checker");
          return `Running checker on selected contract.`;
        },
        help: () => {
          return `
          Available commands: <br/>
          <b>check</b> - Run Checker on selected contract <br/>
          <b>tobech32</b> [ADDRESS] <br/>
          <b>frombech32</b> [ADDRESS] <br/>
          `;
        },
        tobech32: ({ _ }) => {
          return toBech32Address(_[1]);
        },
        frombech32: ({ _ }) => {
          return fromBech32Address(_[1]).toLowerCase();
        }
      }
    };
  },
  mounted() {
    window.EventBus.$on("checker-events", ({ warnings, errors }) => {
      this.checkerWarnings = warnings;
      this.checkerErrors = errors;
    });
    /* window.EventBus.$on("console-log", ({ message, type }) => {
      // console.log(message, type);
      //this.$refs.console.$_executeCommand('help');
    }); */
  }
};
</script>

<style lang="scss" >
.term.white-theme {
  border: 0;
  border-bottom: 1px dashed #ccc;
}
.vue-command {
  .term-std {
    min-height: 600px;
    max-height: 600px;
    overflow-y: scroll;
    border: 0;
  }
}

.checker-results {
  overflow-y: auto;
  .warnings,
  .errors {
    margin-bottom: 1rem;
    overflow-x: scroll;
    .header {
      padding: 0.5rem;
      font-size: 14px;
    }

    .content {
      padding: 0.5rem;
    }

    ul {
      padding: 0;
      list-style: none;
      li {
        font-size: 12px;
      }
    }
  }
}
</style>