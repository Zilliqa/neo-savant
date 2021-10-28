<template>
  <div class="address"><slot></slot> {{ address }}</div>
</template>

<script>
export default {
  props: ["address"],
};
</script>

<style lang="scss" scoped>
.address {
  font-family: "Courier New", Courier, monospace;
}
</style>