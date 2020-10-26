import { Zilliqa as zi } from "@zilliqa-js/zilliqa";
import { mapGetters } from "vuex";
import { bytes, BN, Long } from "@zilliqa-js/util";
import { validation } from "@zilliqa-js/util";

export default {
  data() {
    return {
      Zilliqa: undefined,
    };
  },
  computed: {
    ...mapGetters("networks", { network: "selected" }),
    ...mapGetters("accounts", { account: "selected" }),
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
    getParamType({ type }) {
      const regex = /(?<List>List (.+))|(?<ByStr20>ByStr20)|(?<String>String)|(?<ByStr>ByStr)(\d{1,})?|(?<Uint>Uint)\d{1,}|(?<Int>Int)\d{1,}|(?<BNum>BNum)/;
      const results = type.match(regex).groups;

      let foundType = null;

      for (let key in results) {
        if (results[key] !== undefined) {
          foundType = key;
          break;
        }
      }

      return foundType;
    },
    validateParam({ type, value }) {
      // console.log('validating', type, value);
      switch (type) {
        case 'ByStr20': {
          try {
            if (validation.isAddress(value)) {
              return true;
            }

            throw new Error('ByStr20 should be an address.');
          } catch (error) {
            throw new Error('ByStr20 should be an address.');
          }
        }
        case 'List': {
          try {
            value = JSON.parse(value);
          } catch (e) {
            throw new Error('Lists should be defined as arrays: []');
          }

          if (!Array.isArray(value)) {
            throw new Error('Lists should be defined as arrays: []');
          }
          return true;
        }
        case 'Uint': {
          if ((value && !Number.isInteger(parseInt(value))) || parseInt(value) < 0) {
            throw new Error('Uint should be a positive integer number.');
          }
          return true;
        }
        case 'Int': {
          if (value && !Number.isInteger(parseInt(value))) {
            throw new Error('Int should be a integer number.');
          }
          return true;
        }
        default:
          return true;
      }
    },
    validateParamsObject(params) {
      let errors = false;
      for (let param of params) {
        param.validationErrors = false;
        try {
          const type = this.getParamType({ type: param.type });
          this.validateParam({ ...param, type });
        } catch (error) {
          errors = true;
          param.validationErrors = error.message;
        }
      }

      return { errors, params };
    },
    prepareDataObject(params) {
      const data = params.map((item) => {
        let val = item.value;

        try {
          val = JSON.parse(item.value);

          if (typeof val == "number") {
            val = item.value.toString();
          }
          // eslint-disable-next-line no-empty
        } catch (e) { }

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
    zilliqaPrepareTransaction({ amount, gasPrice, gasLimit, code, data }) {
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
    async handlePrivateKeySign(tx) {
      try {
        await this.Zilliqa.wallet.addByPrivateKey(this.account.keystore);

        const txn = await this.Zilliqa.blockchain.createTransaction(tx);
        return txn;
      } catch (error) {
        this.error = error.message;
      }
    },
    async zilliqaHandleSign(tx) {
      try {
        switch (this.account.type) {
          case "ledger":
            this.handleLedgerSign(tx);
            break;
          case "keystore":
            this.handleKeystoreSign(tx);
            break;
          case "privatekey":
            await this.Zilliqa.wallet.addByPrivateKey(this.account.keystore);
            break;
          case "zilpay":
            this.handleZilPaySign(tx);
            break;
          default:
            throw new Error('There has been an error while accessing account.');

        }

        const txn = await this.Zilliqa.blockchain.createTransaction(tx);
        return txn;
      } catch (error) {
        throw error;
      }

    },
  },
};
