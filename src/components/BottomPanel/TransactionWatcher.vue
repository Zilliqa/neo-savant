<template>
  <div>
    <span v-if="loading">({{ watchTries }} / {{ MAX_TRIES }}) Watching</span>
    0x{{ transaction.id }}
    <span v-if="details"> => {{ details.contractAddress }}</span>
  </div>
</template>

<script>
import zilliqa from "@/mixins/zilliqa";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      loading: false,
      watchTries: 0,
      MAX_TRIES: 60,
      details: undefined,
    };
  },
  props: {
    transaction: {
      type: Object,
    },
  },
  mixins: [zilliqa],
  computed: {
    ...mapGetters("networks", { network: "selected" }),
    ...mapGetters("accounts", { account: "selected" }),
  },
  methods: {
    async watchTx() {
      this.loading = true;
      console.log(this.transaction.id, this.watchTries <= this.MAX_TRIES);
      if (
        this.transaction.id !== undefined &&
        parseInt(this.watchTries) <= this.MAX_TRIES
      ) {
        try {
          const txn = await this.Zilliqa.blockchain.getTransaction(
            this.transaction.id
          );
          if (txn.receipt) {
            const contractAddress = await this.Zilliqa.blockchain.getContractAddressFromTransactionID(
              this.transaction.id
            );

            if (contractAddress.result) {
              console.log("contractAddress", contractAddress);
              this.loading = false;

              const contract = {
                transId: this.transaction.id,
                txData: txn,
                contractId: "0x" + contractAddress.result,
                network: this.network.url,
                file_id: this.transaction.file.id,
                file_name: this.transaction.file.name,
                deployed_by: this.account.address,
                code: this.transaction.file.code,
              };

              console.log("contract", contract);

              this.details = {
                    receipt: txn.receipt,
                    transId: this.transaction.id,
                    contractAddress: "0x" + contractAddress.result,
                  };

              await this.$store
                .dispatch("contracts/AddContract", contract);
            } else {
              this.watchTries = parseInt(this.watchTries) + 1;
              await this.watchTx();
            }
          } else {
            this.watchTries = parseInt(this.watchTries) + 1;
            await this.watchTx();
          }
        } catch (error) {
          if (error.code === -20) {
            this.watchTries = parseInt(this.watchTries) + 1;
            setTimeout(async () => {
              await this.watchTx();
            }, 2000);
          }
        }
      }
    },
  },
  async mounted() {
    if (!this.transaction.watcherDone) {
      await this.watchTx();
    }
  },
};
</script>