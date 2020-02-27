<template>
  <div class="item" :class="{'selected': selected}">
    {{ account.address }}
    <div class="delete" @click="handleDelete(account.address)">[delete]</div>
  </div>
</template>

<script>
export default {
  name: "AccountItem",
  props: ["account", "selected"]
};
</script>

<style lang="scss" scoped>
.item {
  border: 1px dashed #ccc;
  transition: all 0.2s ease-in-out;
  position: relative;

  &.selected {
    background-color: lighten($primary, 30);
    border-color: $primary;

    &:hover {
      background-color: lighten($primary, 30);
      cursor: default;
    }
  }

  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
    cursor: pointer;
  }

  .delete {
    position: absolute;
    top: 5px;
    right: 5px;
    font-size: 12px;
    display: none;
  }
}
</style>