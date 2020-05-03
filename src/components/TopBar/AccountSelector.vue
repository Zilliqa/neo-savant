<template>
  <div class="account-selector d-flex align-items-center mr-4">
    <div class="selected-account">
      <div class="selected-item d-flex align-items-center" v-if="selected !== undefined">
        <img src="@/assets/user.svg" height="24px" class="account-icon mr-2" />
        <copy-to-clipboard class="copy-to-clipboard mr-2" :text="selected.address"></copy-to-clipboard>
        <address-display :address="selected.address"></address-display>
      </div>
      <div class="selected-item d-flex mr-5" @click="handleSelect" v-else>
        <img src="@/assets/user.svg" height="24px" class="mr-5" /> Select an account
      </div>

      <div class="accounts-list flex-column">
        <div class="item item-action">
          <div class="btn-action">Import account</div>
        </div>

        <div class="item-separator"></div>
        <div
          class="item d-flex align-items-center"
          v-for="account in filteredList"
          :key="account.address"
        >
          <copy-to-clipboard :text="account.address"></copy-to-clipboard>
          <address-display
            class="select-account"
            :address="account.address"
            @click="handleSelect(account)"
            title="Click to select account"
          ></address-display>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

import CopyToClipboard from "../UI/CopyToClipboard";
import AddressDisplay from "../UI/AddressDisplay";

export default {
  computed: {
    ...mapGetters("accounts", ["selected", "list"]),
    filteredList() {
      if (this.selected !== undefined) {
        return this.list.filter(item => item.address !== this.selected.address);
      }

      return this.list;
    }
  },
  components: { CopyToClipboard, AddressDisplay },
  methods: {
    handleSelect() {
      window.EventBus.$emit("open-account-selector");
    }
  }
};
</script>

<style lang="scss" scoped>
.account-selector {
  padding: 0 0.5rem;
  transition: all 0.2s ease;
  color: #000;
  position: relative;

  .selected-item {
    .copy-to-clipboard {
      display: none;
    }
  }

  &:hover {
    cursor: default;
    background-color: lighten($primary, 10);

    .selected-item {
      .account-icon {
        display: none;
      }
      .copy-to-clipboard {
        display: block;
      }
    }
  }

  .accounts-list {
    display: none;

    .item {
      padding: 0.5rem;

      .select-account {
        cursor: pointer;
      }

      &:hover {
        background-color: $primary;
      }
    }

    .item-action {
      cursor: pointer;
      padding-left: calc(1rem + 24px);
      font-weight: bold;
    }

    .item-separator {
      border-bottom: 1px solid darken($primary, 10);
    }
  }

  &:hover {
    .accounts-list {
      position: absolute;
      left: 0;
      top: 48px;
      z-index: 9999;
      display: flex;
      background-color: lighten($primary, 10);
    }
  }
}
</style>