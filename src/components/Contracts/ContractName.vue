<template>
  <div
    class="file-name mb-2"
    :class="{'selected' : selected}"
    @click="$emit('select-contract', {contractId: contract.contractId})"
    @contextmenu.prevent="$refs.menu.open"
  >
    <div class="address">
      <address-display :address="contract.contractId"></address-display>
    </div>
    <div class="d-flex tags">
      <div
        v-for="(tag,index) in tags"
        :key="index"
        class="badge mr-1"
        :class="`badge-${tag.color}`"
        @click="handleRemoveTag(index)"
      >
        <span class="remove">X</span>
        {{ tag.value }}
      </div>
    </div>

    <vue-context class="context-menu" ref="menu">
      <li>
        <a href="#" @click.prevent="handleAddTag">Add Tag</a>
      </li>
      <li>
        <a href="#" @click.prevent="handleRemove">Remove</a>
      </li>
    </vue-context>
  </div>
</template>

<script>
import Swal from "sweetalert2";
import VueContext from "vue-context";
import AddressDisplay from "../UI/AddressDisplay";

export default {
  props: ["contract", "selected"],
  components: { VueContext, AddressDisplay },
  data() {
    return {
      tags: this.contract.tags
    };
  },
  watch: {
    "contract.tags": function(val) {
      this.tags = val;
    }
  },
  methods: {
    handleRemove() {
      const confirmed = confirm(
        "Are you sure you want to remove this contract?"
      );
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
    },
    async handleRemoveTag(tagIndex) {
      Swal.fire({
        title: "Are you sure?",
        text: "Confirm that you want to remove the tag.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes"
      }).then(result => {
        if (result.value) {
          this.$store.dispatch("contracts/RemoveTag", {
            contractId: this.contract.contractId,
            tagIndex
          });
        }
      });
    },
    async handleAddTag() {
      const { value: formValues } = await Swal.fire({
        title: "Add contract Tag",
        html: `
          <input id="swal-input1" class="swal2-input" />
          <select id="swal-input2" class="swal2-input">
          <option value="secondary">Select color</option>
          <option value="success">green</option>
          <option value="danger">red</option>
          <option value="info">blue</option>
          </select>`,
        focusConfirm: false,
        preConfirm: () => {
          return {
            value: document.getElementById("swal-input1").value,
            color: document.getElementById("swal-input2").value
          };
        }
      });
      if (formValues) {
        await this.$store.dispatch("contracts/AddTag", {
          id: this.contract.contractId,
          tag: formValues
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.file-name {
  font-size: 0.75rem;
  color: #000;
  padding-top: 5px;
  padding-bottom: 5px;
  .address {
    width: calc(100% - 0.5rem);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  &.selected {
    color: $primary;
    font-weight: bold;
    .tags {
      opacity: 1;
    }
  }
  &:hover {
    cursor: pointer;
    color: $primary;
    .tags {
      opacity: 1;
    }
  }
  .tags {
    transition: all 0.2s;
    opacity: 0.7;
    .badge {
      display: flex;
      align-items: center;
      padding: 4px;
      .remove {
        color: #fff;
        transition: all 0.2s;
        margin-right: 0px;
        margin-right: -6px;
        opacity: 0;
      }
      &:hover {
        .remove {
          opacity: 1;
          margin-right: 5px;
        }
      }
    }
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