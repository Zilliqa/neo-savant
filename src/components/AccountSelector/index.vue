<template>
  <div class="account-selector panel-content">
    <div class="header">
      <div class="title">Account selector</div>
      <img src="@/assets/close-color.svg" @click="handleClose" class="close-button-new" />
    </div>

    <div class="body p-4">
      <div class="accounts-list" v-if="list.length">
        <account-item
          class="item mb-4 p-2"
          v-for="account in list"
          :account="account"
          :selected="(selected && selected.address === account.address)"
          :key="account.address"
          v-on:handle-select="handleSelect(account.address)"
        />
      </div>
      <div v-else>
        <div class="alert alert-info">There are no accounts defined on this network.</div>
      </div>

      <button
        class="btn btn-secondary"
        @click="importAccount = true"
        v-if="!importAccount"
      >Import account</button>

      <div class="import-form" v-if="importAccount">
        <div class="row">
          <div class="col-12 mb-4">
            <label class="font-weight-bold">Select your keystore.json file</label>
            <div class="file-text">
              <div
                v-if="selectedFile !== undefined && selectedFile.name !== undefined"
              >{{ selectedFile.name }}</div>
              <button class="btn btn-secondary p-2 mr-2" @click="$refs.file.click()">
                <i class="fas fa-file-upload"></i> BROWSE
              </button>
            </div>
            <input type="file" ref="file" @change="onFileChange" class="d-none" />
          </div>

          <div class="col-12 mb-4">
            <label class="font-weight-bold">Enter your passphrase</label>
            <input
              type="password"
              class="form-control"
              v-model="passphrase"
              placeholder="Passprase"
            />
          </div>

          <div class="col-12 mb-4" v-if="passphrase && selectedFile && !loading">
            <button class="btn btn-secondary" @click="handleImport">Import wallet</button>
          </div>
          <div class="alert alert-info" v-if="loading">{{loading}}</div>
          <div class="alert alert-danger" v-if="error">{{error}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import { BN, units } from '@zilliqa-js/util';
// import Ledger from '@/utils/zil-ledger-interface';
// import TransportU2F from '@ledgerhq/hw-transport-u2f';
import { Zilliqa } from "@zilliqa-js/zilliqa";
import { mapGetters } from "vuex";
import AccountItem from "./AccountItem.vue";

export default {
  data() {
    return {
      importAccount: false,
      selectedFile: undefined,
      file: undefined,
      passphrase: undefined,
      account: false,
      loading: false,
      error: false
    };
  },
  components: { AccountItem },
  computed: {
    ...mapGetters("accounts", ["list", "selected"]),
    ...mapGetters("networks", { network: "selected" })
  },
  methods: {
    handleClose() {
      window.EventBus.$emit("close-right-panel");
    },
    handleDelete() {},
    async handleSelect(address) {
      await this.$store.dispatch("accounts/SelectAccount", { address });
      window.EventBus.$emit("close-account-selector");
      window.EventBus.$emit("refresh-balance");
    },
    readUploadedFileAsText(inputFile) {
      const temporaryFileReader = new FileReader();

      return new Promise((resolve, reject) => {
        temporaryFileReader.onerror = () => {
          temporaryFileReader.abort();
          reject(new Error("Problem parsing input file."));
        };

        temporaryFileReader.onload = () => {
          resolve(temporaryFileReader.result);
        };
        temporaryFileReader.readAsText(inputFile);
      });
    },
    onFileChange() {
      this.selectedFile = this.$refs.file.files[0];
    },
    async handleImport() {
      this.error = false;
      this.account = false;

      try {
        this.loading = "Trying to decrypt keystore file and access wallet...";

        if (this.zilliqa === undefined) {
          this.zilliqa = new Zilliqa(this.network.url);
        }

        if (this.selectedFile === "" || this.selectedFile === undefined) {
          throw new Error("Please select your keystore file.");
        }

        if (this.passphrase === "" || this.passphrase === undefined) {
          throw new Error("Please enter passphrase.");
        }

        this.file = await this.readUploadedFileAsText(this.selectedFile);

        const address = await this.zilliqa.wallet.addByKeystore(
          this.file,
          this.passphrase
        );

        await this.$store
          .dispatch("accounts/AddAccount", {
            address: address,
            keystore: this.file,
            type: "keystore"
          })
          .then(() => {
            this.importAccount = false;
            this.loading = false;
          });
        window.EventBus.$emit("refresh-balance");
      } catch (error) {
        this.loading = false;
        this.error = error.message;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.btn {
  font-size: 0.85rem !important;
}
</style>