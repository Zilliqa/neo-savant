<template>
  <div class="mb-4 event-item">
    <div class="actions">
      <div class="remove-button" @click="$emit('remove-event')">
        <img src="@/assets/rubbish.svg" />
      </div>
    </div>
    <p class="item-header d-flex align-items-center pb-2">
      <span class="font-weight-bold">{{ event._eventname }}</span>
      <small class="mx-1">@</small>
      <address-display :address="event.address"></address-display>
    </p>
    <vue-json-pretty :data="event.params" />
  </div>
</template>

<script>
import VueJsonPretty from "vue-json-pretty";
import AddressDisplay from "@/components/UI/AddressDisplay";
export default {
  props: ["event"],
  components: { VueJsonPretty, AddressDisplay },
};
</script>

<style lang="scss" scoped>
.event-item {
  padding: 0.5rem;
  border: 1px dashed #ccc;
  position: relative;
  transition: all 0.25s ease-in-out;
  z-index: 999;

  .item-header {
    border-bottom: 1px dashed #ccc;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 0.8rem;
  }

  .remove-button {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: -30px;
    padding: 5px;
    opacity: 0;
    width: 30px;
    z-index: 99;
    transition: all 0.25s ease-in-out;
    cursor: pointer;
  }

  &:hover {
    border: 1px solid $primary;
    margin-left: 1rem;
    .remove-button {
      opacity: 1;
    }
  }
}
</style>
