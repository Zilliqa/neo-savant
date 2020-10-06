<template>
  <div class="alert alert-info">
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
.alert {
  font-size: 0.85rem;

  &.alert-info {
    border: 0;
    background: rgb(242, 242, 242);
    background: linear-gradient(
      180deg,
      $accent-bg 0%,
      lighten(map_get($theme-colors, "info"), 40) 20%,
      lighten(map_get($theme-colors, "info"), 40) 80%,
      $accent-bg 100%
    );
  }
}
</style>
