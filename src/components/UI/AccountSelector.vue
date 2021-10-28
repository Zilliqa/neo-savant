<template>
  <div class="account-selector">
    <label>
      <span class="name">Account</span>
    </label>
    <div class="d-flex mb-2">
      <div class="select-container mr-2">
        <select class="form-control alt" @change="handleSelect">
          <option value="undefined" :selected="selected === undefined">
            Select an account
          </option>
          <option
            v-for="account in list"
            :value="account.address"
            :key="account.address"
            :selected="
              selected !== undefined && account.address === selected.address
            "
          >
            {{ account.address }}
          </option>
        </select>
      </div>

      <copy-to-clipboard
        class="btn btn-outline-secondary mr-2"
        :text="selected.address"
        v-if="selected !== undefined"
      >
        <img src="@/assets/copy.svg" />
      </copy-to-clipboard>

      <button
        class="btn btn-outline-secondary"
        @click="handleOpenAccountImport"
      >
        +
      </button>
    </div>
    <div class="d-flex align-items-center justify-content-between" v-if="selected && selected.address">
      <div>
        <AccountBalance class="ml-2" :address="selected.address" />
      </div>

      <a :href="faucetLink" class="btn btn-link pr-0" target="_blank">Faucet request</a>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import CopyToClipboard from "@/components/UI/CopyToClipboard";
import AccountBalance from "@/components/UI/AccountBalance";
import { toBech32Address } from "@zilliqa-js/crypto";

export default {
  components: {
    CopyToClipboard,
    AccountBalance,
  },
  methods: {
    async handleSelect(ev) {
      const account = this.list.find((i) => i.address === ev.target.value);

      await this.$store.dispatch("accounts/SelectAccount", account);
      window.EventBus.$emit("refresh-balance");
    },
    handleOpenAccountImport() {
      window.EventBus.$emit("open-account-import");
    },
  },
  computed: {
    ...mapGetters("accounts", { list: "list", selected: "selected" }),
    ...mapGetters("networks", { network: "selected" }),
    faucetLink() {
      // the possible chain IDs for the faucet service: 222, 333
      const network =
        this.network.chainId === 222 ? "isolated_server" : "testnet";
      const url = process.env.VUE_APP_FAUCET_URL;
      if (this.selected && this.selected.address) {
        const bech32Address = toBech32Address(this.selected.address);
        return url + `?address=${bech32Address}&network=${network}`;
      }
      return url + `?network=${network}`;
    },
  },
};
</script>
