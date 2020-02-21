<template>
  <div
    class="file-name mb-2"
    :class="{'selected' : selected}"
    @click="$emit('select-contract', {contractId: contract.contractId})"
    @contextmenu.prevent="$refs.menu.open"
  >
    <div>{{ contract.contractId }}</div>
    <div class="text-muted">{{ contract.file_name }}</div>

    <vue-context class="context-menu" ref="menu">
      <!-- <li>
        <a href="#" @click.prevent="handleAddTag">Nickname</a>
      </li>
      <li>
        <a href="#" @click.prevent="handleAddTag">Add Tag</a>
      </li>-->
      <li>
        <a href="#" @click.prevent="handleRemove">Remove</a>
      </li>
    </vue-context>
  </div>
</template>

<script>
import VueContext from "vue-context";
// import Swal from "sweetalert2";

export default {
  props: ["contract", "selected"],
  components: { VueContext },
  methods: {
    handleRemove() {
      const confirmed = confirm("Are you sure you want to remove this contract?");

      if (confirmed) {
        this.$store
          .dispatch("contracts/RemoveContract", {
            id: this.contract.contractId
          })
          .then(() => {
            this.$notify({
              group: "scilla",
              type: "success",
              position: "bottom right",
              title: "Contracts",
              text: "Contract has been removed"
            });
          });
      }
    }
    /* async handleAddTag() {
      const { value: tag } = await Swal.fire({
        title: "Enter tag value",
        input: "text",
        showCancelButton: true,
        inputValidator: value => {
          if (!value) {
            return "You need to write something.";
          }
        }
      });

      console.log(tag);
    } */
  }
};
</script>

<style lang="scss" scoped>
.file-name {
  font-size: 0.75rem;
  color: #000;

  &.selected {
    color: $primary;
  }

  &:hover {
    cursor: pointer;
    color: $primary;
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