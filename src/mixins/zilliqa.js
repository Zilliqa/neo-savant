import { Zilliqa as zi } from "@zilliqa-js/zilliqa";
import { mapGetters } from "vuex";
import validateParams from "@/utils/validation";
import { bytes, BN, Long } from "@zilliqa-js/util";

export default {
  data() {
    return {
      Zilliqa: undefined,
    };
  },
  computed: {
    ...mapGetters("networks", { network: "selected" }),
  },
  async created() {
    this.Zilliqa = new zi(this.network.url);

    this.Zilliqa.VERSION = bytes.pack(
      this.network.chainId,
      this.network.msgVersion
    );
  },
  methods: {
    async getMinimumGasPrice() {
      const minimumGasPrice = await this.Zilliqa.blockchain.getMinimumGasPrice();
      return minimumGasPrice.result;
    },
    validateParamsObject(params) {
      return validateParams([...params]);
    },
    prepareDataObject(params) {
      console.log(params);
      const data = params.map((item) => {
        let val = item.value;

        try {
          val = JSON.parse(item.value);

          if (typeof val == "number") {
            val = item.value.toString();
          }
          // eslint-disable-next-line no-empty
        } catch (e) {}

        return {
          vname: item.vname,
          type: item.type,
          value: val,
        };
      });

      data.push({
        vname: "_scilla_version",
        type: "Uint32",
        value: "0",
      });

      return data;
    },
    prepareTransaction({ amount, gasPrice, gasLimit, code, data }) {
      const tx = this.Zilliqa.transactions.new(
        {
          version: this.Zilliqa.VERSION,
          toAddr: "0x0000000000000000000000000000000000000000",
          amount: new BN(amount),
          gasPrice: new BN(gasPrice),
          gasLimit: Long.fromNumber(gasLimit),
          code: code,
          data: JSON.stringify(data).replace(/\\"/g, '"'),
        },
        true
      );

      return tx;
    },
  },
};
