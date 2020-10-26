<template>
  <div class="account-selector">
    <label>
      <span class="name">Account</span>
    </label>
    <div class="d-flex">
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

      <button class="btn btn-outline-secondary">+</button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import CopyToClipboard from "@/components/UI/CopyToClipboard";

export default {
  components: {
    CopyToClipboard,
  },
  methods: {
    async handleSelect(ev) {
      const account = this.list.find((i) => i.address === ev.target.value);

      await this.$store.dispatch("accounts/SelectAccount", account);
      window.EventBus.$emit("refresh-balance");
    },
  },
  computed: {
    ...mapGetters("accounts", { list: "list", selected: "selected" }),
  },
};
</script>
