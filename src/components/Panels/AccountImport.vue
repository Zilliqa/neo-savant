<template>
  <div class="account-selector panel-content">
    <div class="header">
      <div class="title">Import account on {{ network.name }}</div>
      <img src="@/assets/close-color.svg" @click="handleClose" class="close-button-new" />
    </div>

    <div class="body p-4">
      <div class="type-selector d-flex justify-content-around">
        <div
          class="type-button"
          @click="handleTypeSelect('keystore')"
          :class="{'active': type === 'keystore'}"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 22.604 29.134"
          >
            <g transform="translate(-6.5)">
              <path
                d="M31.515,45.553a1.055,1.055,0,0,0-.4-.337,1.107,1.107,0,0,0-.471-.1,1.241,1.241,0,0,0-.484.1,1.037,1.037,0,0,0-.412.326,1.684,1.684,0,0,0-.285.594,3.479,3.479,0,0,0-.11.893,3.549,3.549,0,0,0,.106.879,1.722,1.722,0,0,0,.275.594,1.1,1.1,0,0,0,.4.337,1.074,1.074,0,0,0,.471.106,1.209,1.209,0,0,0,.484-.1,1.079,1.079,0,0,0,.412-.326,1.646,1.646,0,0,0,.285-.594,3.546,3.546,0,0,0,.11-.9,3.5,3.5,0,0,0-.106-.876A1.762,1.762,0,0,0,31.515,45.553Z"
                transform="translate(-11.375 -22.453)"
              />
              <path
                d="M29.1,19.59V7.021a1.16,1.16,0,0,0-.276-.9L22.982.276A.95.95,0,0,0,22.315,0H7.737A1.3,1.3,0,0,0,6.5,1.47V19.59ZM18.053,16.576a.5.5,0,1,1-1,0V15.069a.5.5,0,1,1,1,0ZM22.071,1.7a.258.258,0,0,1,.441-.182l5.071,5.071a.258.258,0,0,1-.182.441H22.071Zm-.5,10.352V10.046a.5.5,0,0,0-.5-.5.5.5,0,0,1,0-1,1.509,1.509,0,0,1,1.507,1.507v2.009a1.006,1.006,0,0,0,1,1,.5.5,0,1,1,0,1,1.006,1.006,0,0,0-1,1v2.009a1.509,1.509,0,0,1-1.507,1.507.5.5,0,0,1,0-1,.5.5,0,0,0,.5-.5V15.069a2,2,0,0,1,.694-1.507A2,2,0,0,1,21.569,12.055Zm-4.018-1a.753.753,0,1,1-.753.753A.754.754,0,0,1,17.551,11.051ZM11.523,13.06a1.006,1.006,0,0,0,1-1V10.046a1.509,1.509,0,0,1,1.507-1.507.5.5,0,1,1,0,1,.5.5,0,0,0-.5.5v2.009a2,2,0,0,1-.694,1.507,2,2,0,0,1,.694,1.507v2.009a.5.5,0,0,0,.5.5.5.5,0,1,1,0,1,1.509,1.509,0,0,1-1.507-1.507V15.069a1.006,1.006,0,0,0-1-1,.5.5,0,1,1,0-1Z"
              />
              <path
                d="M6.5,41v7.535a1.218,1.218,0,0,0,1.237,1H27.867a1.218,1.218,0,0,0,1.237-1V41Zm5.787,5.307a1.26,1.26,0,0,1-.131.6,1.071,1.071,0,0,1-.35.391,1.4,1.4,0,0,1-.5.206,2.936,2.936,0,0,1-.587.058,2.387,2.387,0,0,1-.354-.031,3.021,3.021,0,0,1-.419-.1q-.216-.066-.415-.148A1.541,1.541,0,0,1,9.19,47.1l.35-.556a1.026,1.026,0,0,0,.2.1q.127.051.278.1t.316.079a1.5,1.5,0,0,0,.309.034,1.055,1.055,0,0,0,.58-.141.556.556,0,0,0,.23-.477V42.365h.838Zm3.987.368a1.381,1.381,0,0,1-.319.453,1.531,1.531,0,0,1-.508.312,1.894,1.894,0,0,1-.687.117c-.11,0-.223-.006-.34-.017a2.759,2.759,0,0,1-.354-.058,1.851,1.851,0,0,1-.34-.114,1.1,1.1,0,0,1-.278-.175l.144-.591a1.466,1.466,0,0,0,.244.106c.1.034.2.066.305.1s.21.054.316.072a1.7,1.7,0,0,0,.3.028.943.943,0,0,0,.642-.2.731.731,0,0,0,.223-.58.554.554,0,0,0-.158-.4,1.71,1.71,0,0,0-.395-.3q-.237-.134-.512-.268a3.122,3.122,0,0,1-.515-.316,1.648,1.648,0,0,1-.4-.429,1.124,1.124,0,0,1-.158-.618,1.38,1.38,0,0,1,.124-.6,1.336,1.336,0,0,1,.333-.443,1.474,1.474,0,0,1,.488-.278,1.779,1.779,0,0,1,.587-.1,3.6,3.6,0,0,1,.638.058,1.407,1.407,0,0,1,.522.189c-.028.059-.059.125-.1.2l-.1.2c-.032.062-.059.114-.082.155a.635.635,0,0,1-.041.069.83.83,0,0,1-.093-.055.7.7,0,0,0-.148-.069,1.054,1.054,0,0,0-.254-.048,2.4,2.4,0,0,0-.405.007.709.709,0,0,0-.261.079.9.9,0,0,0-.22.161.736.736,0,0,0-.151.216.554.554,0,0,0-.055.23.621.621,0,0,0,.158.443,1.548,1.548,0,0,0,.391.3q.233.127.508.247a2.756,2.756,0,0,1,.512.292,1.475,1.475,0,0,1,.395.429,1.248,1.248,0,0,1,.158.663A1.278,1.278,0,0,1,16.274,46.675ZM21.2,46.1a2.3,2.3,0,0,1-.447.81,1.874,1.874,0,0,1-.666.488,2.195,2.195,0,0,1-1.669,0,1.868,1.868,0,0,1-.666-.488,2.3,2.3,0,0,1-.447-.81,4,4,0,0,1,0-2.249,2.3,2.3,0,0,1,.447-.807,1.915,1.915,0,0,1,.666-.491,2.152,2.152,0,0,1,1.669,0,1.909,1.909,0,0,1,.666.491,2.306,2.306,0,0,1,.447.807,4,4,0,0,1,0,2.249ZM26.18,47.53h-.838l-1.985-3.489V47.53H22.52V42.469h.838l1.985,3.489V42.469h.838Z"
                transform="translate(0 -20.406)"
              />
            </g>
          </svg>
          Keystore
        </div>
        <div
          class="type-button"
          @click="handleTypeSelect('ledger')"
          :class="{'active': type === 'ledger'}"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 28.075 28.167"
          >
            <path
              d="M23.64,0H10.683V17.387H28.07V4.522A4.51,4.51,0,0,0,23.64,0ZM6.7,0H4.533A4.544,4.544,0,0,0,0,4.533V6.7H6.7ZM0,10.775H6.7v6.7H0ZM21.371,28.162h2.171a4.544,4.544,0,0,0,4.533-4.533V21.463h-6.7v6.7Zm-10.688-6.7h6.7v6.7h-6.7ZM0,21.463v2.171a4.544,4.544,0,0,0,4.533,4.533H6.7v-6.7Z"
            />
          </svg>
          Ledger
        </div>
      </div>

      <div class="import-form">
        <div class="mb-4" v-if="type === 'ledger'">
          <div class="account-selector">
            <p class="mb-4 text-dark">Select the Ledger Account you want to proceed with</p>
            <table class="table table-sm">
              <thead>
                <tr>
                  <td class="small">#</td>
                  <td class="small">Address</td>
                  <td class="small">Balance</td>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(account, index) in accounts"
                  class="ledger-account-item"
                  :key="index"
                  @click="useLedgerAccount(index)"
                >
                  <td class="small">{{ index }}</td>
                  <td class="small">{{ account.address }}</td>
                  <td class="small">{{ account.balance }} ZIL</td>
                </tr>
              </tbody>
            </table>
            <div class="d-flex justify-content-between">
              <button
                class="btn btn-secondary mr-4"
                @click="generateLedgerAccount"
              >Generate #{{ currentIndex + 1 }}</button>

              <button
                class="btn btn-success"
                @click="useLedgerAccount(0)"
                v-if="accounts.length >= 1"
              >Use #0</button>
            </div>
          </div>
        </div>

        <div class="mb-4" v-if="type === 'keystore'">
          <div class="mb-4">
            <label class="d-block">Select your keystore.json file</label>
            <div class="file-text">
              <button
                class="btn btn-secondary btn-block btn-outline text-secondary mb-2"
                @click="$refs.file.click()"
              >
                <i class="fas fa-file-upload"></i> Browse
              </button>
              <div
                class="selected-file"
                v-if="selected !== undefined && selected.name !== undefined"
              >{{ selected.name }}</div>
            </div>
            <input type="file" ref="file" @change="onFileChange" class="d-none" />
          </div>

          <div>
            <label>Enter your passphrase</label>
            <input
              type="password"
              class="form-control"
              v-model="passphrase"
              placeholder="Passprase"
            />
          </div>
        </div>

        <div class="loading my-4" v-if="loading">
          <div class="icon text-center">
            <i class="fas fa-spinner fa-spin"></i>
            {{ loading }}
          </div>
        </div>

        <div class="buttons d-flex">
          <button class="btn btn-light text-danger text-small mr-2" @click="handleClose">
            <small>Cancel</small>
          </button>
          <button class="btn btn-primary btn-block" @click="handleImport">
            <i class="fas fa-user-plus"></i>
            Import account
          </button>
        </div>

        <div class="alert alert-danger my-2" v-if="error">{{ error }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { BN, units } from "@zilliqa-js/util";
import LedgerInterface from "@/utils/ledger-interface";
import TransportU2F from "@ledgerhq/hw-transport-u2f";
import { Zilliqa } from "@zilliqa-js/zilliqa";
import { mapGetters } from "vuex";
import { fromBech32Address } from "@zilliqa-js/crypto";

export default {
  data() {
    return {
      type: "keystore",
      file: null,
      selected: undefined,
      passphrase: "",
      error: false,
      loading: false,
      zilliqa: undefined,
      currentIndex: -1,
      accounts: []
    };
  },
  computed: {
    ...mapGetters("networks", { network: "selected" })
  },
  methods: {
    handleClose() {
      window.EventBus.$emit("close-right-panel");
    },
    handleTypeSelect(type) {
      this.type = type;
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
      this.selected = this.$refs.file.files[0];
    },
    async handleImport() {
      if (this.type === "keystore") {
        await this.tryKeystoreLogin();
      }
    },
    async generateLedgerAccount() {
      this.loading = "Trying to create U2F transport.";
      const transport = await TransportU2F.create();
      this.loading = "Trying to initialize Ledger Transport";
      const zil = new LedgerInterface(transport);
      this.loading = "Please confirm action on Ledger Device";
      const address = await zil.getPublicAddress(this.currentIndex + 1);
      if (this.zilliqa === undefined) {
        this.zilliqa = new Zilliqa(this.network.url);
      }
      let balance = await this.zilliqa.blockchain.getBalance(address.pubAddr);
      if (balance.error && balance.error.code === -5) {
        this.accounts.push({
          index: this.currentIndex + 1,
          address: fromBech32Address(address.pubAddr),
          balance: 0
        });
      } else {
        const zils = units.fromQa(
          new BN(balance.result.balance),
          units.Units.Zil
        );
        this.accounts.push({
          index: this.currentIndex + 1,
          address: fromBech32Address(address.pubAddr),
          balance: zils
        });
      }
      this.currentIndex = this.currentIndex + 1;
      transport.close();
      this.loading = false;
    },
    async useLedgerAccount(index) {
      const account = this.accounts[index];
      await this.$store
          .dispatch("accounts/AddAccount", {
            address: account.address,
            keystore: account.index,
            type: "ledger"
          })
          .then(() => {
            window.EventBus.$emit("refresh-balance");
            window.EventBus.$emit("close-right-panel");
            this.$notify({
              group: "scilla",
              type: "success",
              position: "bottom right",
              title: "Accounts",
              text: "Account successfully imported"
            });
            this.importAccount = false;
            this.loading = false;
          });
      window.EventBus.$emit("login-success", {
        keystore: account.index,
        address: account.address
      });
      if (this.address !== null) {
        this.$emit("close-login");
      }
    },
    async tryKeystoreLogin() {
      this.error = false;
      this.login = false;

      try {
        this.loading = "Trying to decrypt keystore file and access wallet...";
        if (this.zilliqa === undefined) {
          this.zilliqa = new Zilliqa(this.network.url);
        }
        if (this.selected === "" || this.selected === undefined) {
          throw new Error("Please select your keystore file.");
        }
        if (this.passphrase === "" || this.passphrase === undefined) {
          throw new Error("Please enter passphrase.");
        }
        this.file = await this.readUploadedFileAsText(this.selected);
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
            window.EventBus.$emit("refresh-balance");
            window.EventBus.$emit("close-right-panel");
            this.$notify({
              group: "scilla",
              type: "success",
              position: "bottom right",
              title: "Accounts",
              text: "Account successfully imported"
            });
            this.importAccount = false;
            this.loading = false;
          });

        this.loading = false;
      } catch (error) {
        this.loading = false;
        this.error = error.message;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.type-selector {
  padding-bottom: 1rem;
  margin-bottom: 1rem;
  border-bottom: 1px dashed transparentize($color: $primary, $amount: 0.85);

  .type-button {
    border-radius: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 120px;
    height: 80px;
    border: 2px solid $primary;
    background-color: transparent;
    color: $primary;
    font-weight: bold;

    svg {
      fill: $primary;
    }

    &:hover,
    &.active {
      border: 2px solid $primary;
      background-color: $primary;
      color: #fff;
      cursor: pointer;
      svg {
        fill: #fff;
      }
    }
  }
}

.account-selector {
  .ledger-account-item {
    &:hover {
      cursor: pointer;
      background-color: transparentize($color: $primary, $amount: 0.7);
    }
  }
}

.import-form {
  .selected-file {
    font-size: 0.85rem;
    font-family: "Courier New", Courier, monospace;
  }
}
</style>