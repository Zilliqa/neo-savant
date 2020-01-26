<template>
  <div
    class="file-name mb-2"
    :class="{'selected' : selected}"
    @click="$emit('select-contract', {contractId: contract.contractId})"
  >
    <div>0x{{ contract.contractId }}</div>
    <div class="text-muted">{{ contract.file_id }}</div>
  </div>
</template>

<script>
export default {
  props: ["contract", "selected"]
};
</script>

<style lang="scss" scoped>
.file-name {
  font-size: 0.75rem;
  color: #000;

  &.selected {
    color: $primary;
  }

  &:hover {
    cursor: pointer;
    color: $primary;
  }
}
</style>