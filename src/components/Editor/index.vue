<template>
  <div class="editor">
    <div class="actions-bar" v-if="!readonly && file !== null">
      <div class="d-flex justify-content-between align-items-center">
        <div class="buttons d-flex">
          <button class="btn btn-check mr-2 ml-2" @click="handleCheck">
            <img src="@/assets/survey.svg" /> CHECK
          </button>
          <button class="btn btn-link mr-2" @click="handleDeploy">
            <img src="@/assets/send.svg" /> DEPLOY
          </button>

          <button class="btn btn-link" v-if="changed" @click="handleSave">
            <img src="@/assets/save.svg" /> SAVE
          </button>
        </div>
        <div class="message d-flex align-items-center" v-if="changed">Remember to save changes</div>
      </div>
    </div>
    <ace-editor
      v-if="file !== null"
      v-model="file.code"
      :fontSize="14"
      :showPrintMargin="true"
      :showGutter="true"
      :highlightActiveLine="true"
      ref="aceEditor"
      mode="scilla"
      lang="scilla"
      theme="tomorrow"
      :annotations="annotations"
      width="100%"
      height="calc(100% - 50px)"
      :onChange="handleInput"
      :readOnly="readonly"
      name="editor"
      :editorProps="{$blockScrolling: true}"
    />
    <ace-editor
      v-else
      v-model="code"
      :fontSize="14"
      :showPrintMargin="true"
      :showGutter="true"
      :highlightActiveLine="true"
      ref="aceEditor"
      mode="scilla"
      lang="scilla"
      theme="tomorrow"
      width="100%"
      height="100%"
      :readOnly="true"
      name="editor2"
    />
  </div>
</template>

<script>
/*eslint-disable */
import brace from "brace"; // eslint-disable-line no-use-before-define
/*eslint-enable */
import { Ace as AceEditor } from "vue2-brace-editor";

import "./scilla_mode";
import "brace/mode/javascript";
import "brace/theme/tomorrow";

import axios from "axios";
import { Zilliqa } from "@zilliqa-js/zilliqa";
import { mapGetters } from "vuex";

export default {
  props: ["file"],
  data() {
    return {
      code: null,
      changed: false,
      readonly: false,
      annotations: [],
      SCILLA_CHECKER_URL: process.env.VUE_APP_SCILLA_CHECKER_URL
    };
  },
  computed: {
    ...mapGetters("networks", { network: "selected" })
  },
  methods: {
    editorInit: function() {
      require("brace/ext/language_tools"); //language extension prerequsite...
      require("brace/theme/tomorrow");
      require("./scilla_mode");
    },
    handleInput(payload) {
      this.changed = true;
      this.file.code = payload;
    },
    async handleSave() {
      await this.$store.dispatch("files/UpdateCode", {
        id: this.file.id,
        code: this.file.code
      });
      this.changed = false;
    },
    handleDeploy() {
      window.EventBus.$emit("open-deploy-contract", this.file);
    },
    async handleCheck() {
      this.annotations = [];

      window.EventBus.$emit("console-log", {
        message: `Running checker on ${this.file} contract.`
      });

      axios
        .post(this.SCILLA_CHECKER_URL, {
          code: this.file.code
        })
        .then(response => {
          if (response.data.result === "success") {
            const message = JSON.parse(response.data.message);

            if (message.warnings !== []) {
              const markers = message.warnings.map(err => {
                const row = parseInt(err.start_location.line, 10);
                const column = parseInt(err.start_location.column, 10);

                return {
                  row: row === 0 ? 0 : row - 1,
                  column,
                  type: "warning",
                  text: err.warning_message
                };
              });

              window.EventBus.$emit("checker-events", { warnings: markers });

              this.annotations = markers;
            }
            // this.checked = true;
            window.EventBus.$emit("console-log", {
              message: `Contract check successfully passed.`
            });
            this.$notify({
              group: "scilla",
              type: "success",
              position: "bottom right",
              title: "Scilla Checker",
              text: "Contract has been successfully checked"
            });
          }
        })
        .catch(error => {
          window.EventBus.$emit("console-log", {
            message: `There are errors in your contract.`,
            type: "error"
          });
          this.$notify({
            group: "scilla",
            type: "error",
            position: "bottom right",
            title: "Scilla Checker",
            text: "There are errors in your contract. Check the editor."
          });
          const markers = error.response.data.message.map(err => {
            const row = parseInt(err.line, 10);
            const col = parseInt(err.column, 10);

            return {
              row: row === 0 ? 0 : row - 1,
              column: col,
              type: "error",
              text: err.msg
            };
          });

          window.EventBus.$emit("checker-events", { errors: markers });

          this.annotations = markers;
        });
    },
    async changeEditorCode({ type, contractId }) {
      if (type === "deployed-contract") {
        const zilliqa = new Zilliqa(this.network.url);

        console.log("cid", contractId);

        const contractCode = await zilliqa.blockchain.getSmartContractCode(
          contractId
        );

        this.readonly = true;
        this.code = contractCode.result.code;
      }
    }
  },
  components: {
    AceEditor
  },
  mounted() {
    this.changed = false;

    window.EventBus.$on("console-run-checker", () => {
      this.handleCheck();
    });

    window.EventBus.$on("open-editor-contract", ({ contractId }) => {
      this.changeEditorCode({
        type: "deployed-contract",
        contractId: contractId
      });
      this.$store.dispatch("files/SelectFile", null);
    });
  }
};
</script>

<style lang="scss" scoped>
.editor {
  height: 100%;

  .actions-bar {
    padding: 0.5rem;
    padding-left: 0;
    font-size: 0.85rem;
    height: 50px;
  }

  .btn {
    font-family: "Montserrat", sans-serif;

    color: #000;
    font-weight: 500;
    font-size: 0.85rem;

    background-color: lighten($primary, 40);

    &:hover {
      background-color: rgba(0, 0, 0, 0.1);
      text-decoration: none;
    }

    img {
      height: 1rem;
    }
  }
}
</style>