<template>
  <v-popover offset="16" trigger="click" placement="top">
    <!-- This will be the popover target (for the events and position) -->
    <a class="tooltip-target d-flex align-items-center">
      <span>{{ type }}</span>
      <img class="ml-1" src="@/assets/question.svg" />
    </a>

    <!-- This will be the content of the popover -->
    <template slot="popover">
      Scilla defines signed and unsigned integer types of 32, 64, 128, and 256 bits. These integer types can be specified with the keywords IntX and UintX where X can be 32, 64, 128, or 256. For example, the type of an unsigned integer of 32 bits is Uint32. Read more about this
      <a
        href="https://scilla.readthedocs.io/en/latest/scilla-in-depth.html#integer-types"
        target="_blank"
      >here</a>
    </template>
  </v-popover>
</template>

<script>
export default {
  props: ["type"]
};
</script>

<style lang="scss" scoped>
.tooltip-target {
  img {
    height: 12px;
  }
}
</style>