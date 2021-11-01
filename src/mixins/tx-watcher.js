export default {
    data() {
        return {
            TxWatcherMAX_TRIES: 60,
        }
    },
    methods: {
        async TxWatcher(txList) {
            for (const tx of txList) {
                this.TxWatcherWatchTx({
                    ...tx,
                    TxWatcherTRIES: 0,
                    TxWatcherLOADING: true
                });
            }
        },
        async TxWatcherWatchTx(tx) {
            tx.TxWatcherLOADING = true;
            if (
                tx.id !== undefined &&
                parseInt(tx.TxWatcherTRIES) <= this.TxWatcherMAX_TRIES
            ) {
                try {
                    const txn = await this.Zilliqa.blockchain.getTransaction(
                        tx.id
                    );
                    tx.TxWatcherLOADING = false;
                    await this.$store.dispatch("transactions/UpdateWatcherTx", { ...tx, receipt: txn.receipt });
                    if (txn.receipt) {
                        const contractAddress = await this.Zilliqa.blockchain.getContractAddressFromTransactionID(
                            tx.id
                        );

                        if (contractAddress.result) {
                            tx.TxWatcherLOADING = false;

                            const contract = {
                                transId: tx.id,
                                txData: txn,
                                contractId: "0x" + contractAddress.result,
                                network: this.network.url,
                                file_id: tx.file.id,
                                file_name: tx.file.name,
                                deployed_by: this.account.address,
                                code: tx.file.code,
                            };


                            this.details = {
                                receipt: txn.receipt,
                                transId: tx.id,
                                contractAddress: "0x" + contractAddress.result,
                            };

                            await this.$store
                                .dispatch("contracts/AddContract", contract);
                        } else {
                            tx.TxWatcherTRIES = parseInt(tx.TxWatcherTRIES) + 1;
                            await this.TxWatcherWatchTx(tx);
                        }
                    } else {
                        tx.TxWatcherTRIES = parseInt(tx.TxWatcherTRIES) + 1;
                        await this.TxWatcherWatchTx(tx);
                    }
                } catch (error) {
                    if (error.code === -20) {
                        tx.TxWatcherTRIES = parseInt(tx.TxWatcherTRIES) + 1;
                        setTimeout(async () => {
                            await this.TxWatcherWatchTx(tx);
                        }, 2000);
                    }
                }
            }
        },
    }
}