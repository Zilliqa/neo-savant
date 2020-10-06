<template>
  <div class="checker-results">
    <div class="content">
      <ul>
        <li v-for="(item, index) in events" :key="index">
          <div
            class="pl-3"
            v-if="item.text"
            :class="{
              warning: item.type === 'warning',
              danger: item.type === 'error',
            }"
          >
            ({{ item.row + 1 }}, {{ item.column }}) {{ item.text }}
          </div>
          <div v-else>{{ item }}</div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      events: [],
    };
  },
  mounted() {
    window.EventBus.$on("checker-events-clear", () => {
      this.events = [];
    });

    window.EventBus.$on("checker-events", ({ warnings, errors, message }) => {
      if (warnings !== undefined) {
        warnings.forEach((item) => {
          this.events.push(item);
        });
      }

      if (errors !== undefined) {
        errors.forEach((item) => {
          this.events.push(item);
        });
      }

      if (message !== undefined) {
        this.events.push(message);
      }
    });
  },
};
</script>

<style lang="scss" scoped>
.checker-results {
  .content {
    padding: 0.5rem;
    font-family: monospace;

    .warning {
      border-left: 4px solid map_get($theme-colors, "warning");
    }
    .danger {
      border-left: 4px solid map_get($theme-colors, "danger");
    }
  }

  ul {
    padding: 0;
    list-style: none;
    li {
      font-size: 12px;
    }
  }
}
</style>
