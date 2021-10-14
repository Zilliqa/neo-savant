<template>
  <div class="input-contract">
    <label class="d-flex align-items-center">
      <div class="name">{{ name }}</div>
      <div class="type">
        <input-popover :type="type"></input-popover>
      </div>
    </label>
    <input
      type="text"
      :value="def"
      @input="$emit('input', $event.target.value)"
      class="form-control alt"
    />
  </div>
</template>

<script>
import InputPopover from "@/components/UI/InputPopover";
export default {
  props: ["type", "name", "def"],
  components: { InputPopover },
};
</script>
