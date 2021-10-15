<template>
  <div
    class="file-name mb-2"
    :class="{ selected: selected }"
    @click="$emit('select-tx', { txId: tx.id })"
  >
    <div class="address">
      <address-display :address="tx.id"></address-display>
    </div>
  </div>
</template>

<script>
import AddressDisplay from "@/components/UI/AddressDisplay";

export default {
  props: ["tx", "selected"],
  components: { AddressDisplay },
};
</script>

<style lang="scss" scoped>
.file-name {
  font-size: 0.75rem;
  color: #000;
  padding-top: 5px;
  padding-bottom: 5px;
  .address {
    width: calc(100% - 0.5rem);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  &.selected {
    color: $primary;
    font-weight: bold;
    .tags {
      opacity: 1;
    }
  }
  &:hover {
    cursor: pointer;
    color: $primary;
    .tags {
      opacity: 1;
    }
  }
  .tags {
    transition: all 0.2s;
    opacity: 0.7;
    .badge {
      display: flex;
      align-items: center;
      padding: 4px;
      .remove {
        color: #fff;
        transition: all 0.2s;
        margin-right: 0px;
        margin-right: -6px;
        opacity: 0;
      }
      &:hover {
        .remove {
          opacity: 1;
          margin-right: 5px;
        }
      }
    }
  }
}
.context-menu {
  li {
    a {
      font-size: 14px;
    }
  }
}
</style>
