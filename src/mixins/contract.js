export default {
  data() {
    return {
      contract: {
          abi: undefined,
          code: undefined
      },
    };
  },
  methods: {
    async getContractAbi({ code }) {
      this.contract.code = code;

      const response = await fetch(process.env.VUE_APP_SCILLA_CHECKER_URL, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: code }),
      });

      const data = await response.json();

      if (data.result === "success") {
        const { contract_info } = JSON.parse(data.message);
        
        this.contract.abi = contract_info;

        this.contract.abi.params = this.contract.abi.params.map((item) => {
          return {
            ...item,
            value: "",
          };
        });
      }

      return this.contract;
    },
  },
};
