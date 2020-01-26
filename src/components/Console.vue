<template>
  <vue-command
    :yargs-options="{ alias: { color: ['colour'] } }"
    :commands="commands"
    title="Savant IDE Console"
    :white-theme="true"
    :hide-bar="true"
    prompt="$"
  />
</template>

<script>
import VueCommand from "vue-command";
import "vue-command/dist/vue-command.css";

export default {
  components: {
    VueCommand
  },
  data() {
    return {
      commands: {
        // [0] -> command > [1] -> arg
        log: ({ _ }) => {
          return _[1];
        }
      }
    };
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
</style>