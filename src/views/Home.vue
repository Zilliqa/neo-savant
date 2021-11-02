<template>
  <div class="home">
    <editor
      v-if="selectedFile || selectedContract"
      :file="selectedFile"
      :secondFile="selectedContract"
    />
    <div class="welcome p-5" v-else>
      <h2>Welcome to Neo Savant IDE!</h2>
      <p>
        Learn more about what you can do by visiting
        <router-link
          to="https://scilla.readthedocs.io/en/latest/scilla-trial.html"
          >Scilla Docs</router-link
        >
        or by exploring an Example Contract from the Files section.
      </p>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Editor from "@/components/Editor/Mona";
import { mapGetters } from "vuex";

export default {
  name: "home",
  components: {
    Editor,
  },
  computed: {
    ...mapGetters("files", { selectedFile: "selected" }),
    ...mapGetters("contracts", { selectedContract: "selected" }),
  },
  created() {
    if (this.$route.params && this.$route.params.code) {
      this.$store.dispatch("files/OpenExternalCode", {
        code: this.$route.params.code,
      });
    }
  },
};
</script>

<style lang="scss" scoped>
.home {
  height: 100%;
}
</style>
