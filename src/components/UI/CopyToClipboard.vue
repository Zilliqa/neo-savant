<template>
  <button
    class="copy-to-clipboard"
    @click.prevent="handleCopy"
    title="Click to copy address"
    :disabled="done"
  >
    <slot v-if="!done"></slot>
    <img src="@/assets/tick.svg" v-else />
  </button>
</template>

<script>
export default {
  name: "CopyToClipboard",
  data() {
    return {
      done: false,
    };
  },
  props: ["text"],
  methods: {
    handleCopy(ev) {
      ev.preventDefault();
      if (navigator.clipboard) {
        navigator.clipboard.writeText(this.text).then(() => {
          this.done = true;
          setTimeout(() => {
            this.done = false;
          }, 2000);
        });
      } else {
        const input = document.createElement("input");
        document.body.appendChild(input);
        input.value = this.text;
        input.focus();
        input.select();
        const result = document.execCommand("copy");
        if (result !== "unsuccessful") {
          this.done = true;
          setTimeout(() => {
            this.done = false;
          }, 2000);
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.copy-to-clipboard {
  .fas {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    opacity: 0.5;
    transition: all 0.2s ease-in-out;
  }
}
</style>