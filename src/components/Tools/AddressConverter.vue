<template>
  <div class="panel">
    <h5 class="mb-4">Address Converter</h5>

    <div class="form-group mb-4">
      <label>Bech32 Address</label>
      <input type="text" class="form-control mb-2" :value="bech32" @change="handleBech32Change" />
      <div class="text-danger text-small" v-if="bech32Error">{{ bech32Error }}</div>
    </div>

    <div class="form-group">
      <label>Base16 Address</label>
      <input type="text" class="form-control mb-2" :value="base16" @change="handleBase16Change" />
      <div class="text-danger text-small" v-if="base16Error">{{ base16Error }}</div>
    </div>
  </div>
</template>

<script>
import { toBech32Address, fromBech32Address } from "@zilliqa-js/crypto";
import { validation } from "@zilliqa-js/util";

export default {
  data() {
    return {
      bech32: "",
      bech32Error: false,
      base16: "",
      base16Error: false
    };
  },
  methods: {
    handleBech32Change(ev) {
      this.bech32Error = false;
      this.bech32 = ev.target.value;

      if (!validation.isBech32(this.bech32)) {
        return (this.bech32Error = "The string is not a valid Bech32 address.");
      } else {
        this.base16 = fromBech32Address(this.bech32);
      }
    },

    handleBase16Change(ev) {
      this.bech32Error = false;
      this.base16 = ev.target.value;

      if (!validation.isAddress(this.base16)) {
        return (this.base16Error = "The string is not a valid Base16 address.");
      } else {
        this.bech32 = toBech32Address(this.base16);
      }
    }
  }
};
</script>