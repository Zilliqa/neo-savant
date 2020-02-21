<template>
  <div class="account-selector d-flex align-items-center mr-4">
    <div class="selected-account">
      <div v-if="selected" @click="handleSelect">
        <img src="@/assets/user.svg" height="24px" class="mr-2" />
        {{selected.address}}
      </div>
      <div @click="handleSelect" v-else>
        <img src="@/assets/settings.svg" height="24px" class="mr-2" /> Select an account
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters("accounts", ["selected"])
  },
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

  &:hover {
    cursor: pointer;
    background-color: lighten($primary, 10);
  }
}
</style>