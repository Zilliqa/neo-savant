<template>
  <div class="nav-item">
    <a
      class="nav-link d-flex align-items-center"
      :class="{ active: selected, contract: item.type === 'contract' }"
    >
      <div class="file-name" @click="$emit('select-file')">
        <file-icon :type="item.type" :ext="item.ext" />
        {{ item.name }}{{ item.ext ? `.${item.ext}` : null }}
      </div>
      <div class="action ml-2">
        <img
          src="@/assets/x.svg"
          class="img-button close-button"
          :class="{ hidden: changed }"
          @click.prevent="$emit('close-file')"
        />
        <img
          src="@/assets/black-circle.svg"
          class="img-button warning-button"
          v-if="changed"
        />
      </div>
    </a>
  </div>
</template>

<script>
import FileIcon from "@/components/UI/FileIcon";

export default {
  props: ["item", "selected", "changed"],
  components: {
    FileIcon,
  },
};
</script>

<style lang="scss" scoped>
.nav-item {
  .nav-link {
    padding: 0.25rem 0.75rem;
    font-size: 0.85rem;
    cursor: pointer;
    border-radius: 0;
    background-color: $accent-bg;
    border-right: 1px solid darken($accent-bg, 10);
    height: 2rem;
    color: #000;

    .close-button {
      visibility: hidden;

      &.hidden {
        display: none;
      }
    }

    &.active {
      background-color: $body-bg;
      border-bottom: 2px solid $primary;

      .close-button {
        visibility: visible;
      }
    }

    &:hover {
      .warning-button {
        display: none;
      }
      .close-button {
        display: block;
        visibility: visible;
      }
    }
  }

  .img-button {
    height: 0.6rem;
  }
}
</style>
