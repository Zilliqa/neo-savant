<template>
  <div class="account-selector">
    <label>
      <span class="name">Account</span>
    </label>
    <div class="d-flex">
      <div class="select-container mr-2">
        <select class="form-control alt">
          <option v-for="account in list" :key="account.address">
            {{ account.address }}
          </option>
        </select>
      </div>
      <button class="btn btn-outline-secondary mr-2">
        <img src="@/assets/copy.svg" />
      </button>
      <button class="btn btn-outline-secondary">
        +
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters("accounts", { list: "list", selected: "selected" }),
  },
};
</script>
