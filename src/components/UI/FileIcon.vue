<template>
  <img
    src="@/assets/logo.png"
    class="file-logo"
    v-if="type !== 'deployed-contract'"
  />
  <img src="@/assets/contracts.svg" class="file-logo" v-else />
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: undefined,
    },
    ext: {
      type: String,
      default: undefined,
    },
  },
};
</script>


<style lang="scss" scoped>
.file-logo {
  width: 16px;
}
</style>