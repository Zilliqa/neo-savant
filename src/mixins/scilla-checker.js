export default {
  data() {
    return {
      SCILLA_CHECKER_URL: process.env.VUE_APP_SCILLA_CHECKER_URL,
    };
  },
  methods: {
    async runScillaChecker(code) {
      let annotations = [];

      window.EventBus.$emit("checker-events-clear");

      window.EventBus.$emit("checker-events", {
        message: `○ Running checker on ${this.file.name}`,
      });

      const response = await fetch(this.SCILLA_CHECKER_URL, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: code }),
      });

      const data = await response.json();

      if (data.result === "success") {
        const message = JSON.parse(data.message);

        if (message.warnings !== []) {
          const markers = message.warnings.map((err) => {
            const row = parseInt(err.start_location.line, 10);
            const column = parseInt(err.start_location.column, 10);

            return {
              row: row === 0 ? 0 : row - 1,
              column,
              type: "warning",
              text: err.warning_message,
            };
          });

          window.EventBus.$emit("checker-events", {
            warnings: markers,
          });

          annotations = markers;
        }

        window.EventBus.$emit("checker-events", {
          message: "✓ Checker successfully passed.",
        });

        this.$notify({
          group: "scilla",
          type: "success",
          position: "bottom right",
          title: "Scilla Checker",
          text: "Contract checker successfully passed.",
        });
      }

      if (data.result === "error") {
        const markers = data.message.map((err) => {
          const row = parseInt(err.line, 10);
          const col = parseInt(err.column, 10);

          return {
            row: row === 0 ? 0 : row - 1,
            column: col,
            type: "error",
            text: err.msg,
          };
        });

        window.EventBus.$emit("checker-events", { errors: markers });

        annotations = markers;

        window.EventBus.$emit("checker-events", {
          message: "✗ Checker failed on the contract.",
        });
      }

      return annotations;
    },
  },
};
