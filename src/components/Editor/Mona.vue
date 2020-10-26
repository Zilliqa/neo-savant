<template>
  <div class="editor">
    <div class="actions-bar" v-if="file && !file.contractId">
      <div class="d-flex justify-content-between align-items-center">
        <div class="buttons d-flex">
          <button class="btn btn-check mr-2 ml-2" @click="handleRunChecker">
            <img src="@/assets/survey.svg" /> CHECK
          </button>
          <button class="btn btn-link mr-2" @click="handleDeploy">
            <img src="@/assets/send.svg" /> DEPLOY
          </button>

          <button class="btn btn-link" v-if="changed" @click="handleSave">
            <img src="@/assets/save.svg" /> SAVE
          </button>
        </div>
        <div class="message d-flex align-items-center" v-if="changed">
          Remember to save changes
        </div>
      </div>
    </div>
    <tabs :changed="changed" v-if="file && !file.contractId" />
    <div class="editor-inner" ref="editor"></div>
  </div>
</template>

<script>
/* eslint-disable no-useless-escape */
import * as monaco from "monaco-editor";
import { mapGetters } from "vuex";

import Tabs from "./Tabs";
import scillaChecker from "@/mixins/scilla-checker";

export default {
  props: {
    file: {
      type: Object,
      default: undefined,
    },
  },
  data() {
    return {
      code: null,
      changed: false,
      annotations: [],
      commands: [],
      editor: undefined,
    };
  },
  mixins: [scillaChecker],
  computed: {
    ...mapGetters("networks", { network: "selected" }),
    ...mapGetters("general", { editorSettings: "editor" }),
    readonly() {
      return this.file.contractId !== undefined;
    },
  },
  methods: {
    handleInput(payload) {
      this.changed = this.file.id;
      this.file.code = payload;
    },
    async handleSave() {
      await this.$store.dispatch("files/UpdateCode", {
        id: this.file.id,
        code: this.file.code,
      });
      this.changed = false;
    },
    handleDeploy() {
      window.EventBus.$emit("open-deploy-contract", this.file);
    },
    async handleRunChecker() {
      const checkerResults = await this.runScillaChecker({
        code: this.file.code,
        name: this.file.name,
      });

      this.annotations = checkerResults.annotations;
    },
  },
  components: {
    Tabs,
  },
  watch: {
    file(newValue, oldValue) {
      if (newValue.code !== oldValue.code) {
        console.log(this.editor);
        this.editor.getModel().setValue(newValue.code);
      }
    },
  },
  mounted() {
    const el = this.$refs.editor;

    // Register a new language
    monaco.languages.register({ id: "scilla" });

    // Register a tokens provider for the language
    monaco.languages.setMonarchTokensProvider("scilla", {
      keywords: [
        "contains",
        "delete",
        "put",
        "remove",
        "library",
        "import",
        "contract",
        "event",
        "field",
        "send",
        "fun",
        "transition",
        "procedure",
        "match",
        "end",
        "with",
        "builtin",
        "Emp",
        "of",
      ],

      constants: [
        "Bool",
        "Option",
        "List",
        "BNum",
        "BLOCKNUMBER",
        "Message",
        "Event",
        "Uint256",
        "Uint128",
        "Uint64",
        "Uint32",
        "Int256",
        "Int128",
        "Int64",
        "Int32",
        "ByStr20",
        "ByStr32",
        "ByStr33",
      ],
      constructors: [
        "Map",
        "Emp",
        "Cons",
        "Nil",
        "Some",
        "None",
        "False",
        "True",
      ],
      operators: [
        "eq",
        "add",
        "sub",
        "mul",
        "div",
        "rem",
        "lt",
        "blt",
        "in",
        "substr",
        "sha256hash",
        "keccak256hash",
        "ripemd160hash",
        "to\\_byStr",
        "to\\_nat",
        "pow",
        "to\\_uint256",
        "to\\_uint32",
        "to\\_uint64",
        "to\\_uint128",
        "to\\_int256",
        "to\\_int32",
        "to\\_int64",
        "to\\_list",
        "to\\_int128",
        "schnorr\\_verify",
        "concat",
        "andb",
        "orb",
        "bool_to_string",
        "negb",
        "Nil",
      ],
      storage: ["let", "fun", "tfun", "type"],
      symbols: /[=><!~?:&|+\-*\/\^%]+/,

      escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
      digits: /\d+(_+\d+)*/,
      octaldigits: /[0-7]+(_+[0-7]+)*/,
      binarydigits: /[0-1]+(_+[0-1]+)*/,
      hexdigits: /[[0-9a-fA-F]+(_+[0-9a-fA-F]+)*/,

      tokenizer: {
        root: [
          [/\(\*.*\*\)/, "comment"],
          // identifiers and keywords
          [
            /[A-Z][\w\$]*/,
            {
              cases: {
                "@constants": "constant",
                "@keywords": "keyword",
                "@constructors": "constructor",
                "@default": "identifier",
              },
            },
          ],

          [
            /[a-z][\w\$]*/,
            {
              cases: {
                "@storage": "storage",
                "@operators": "operator",
                "@keywords": "keyword",
                "@constants": "constant",
                "@default": "",
              },
            },
          ],

          // delimiters and operators
          [/@symbols/, { cases: { "@operators": "operator", "@default": "" } }],

          // numbers
          [/\d*\.\d+([eE][\-+]?\d+)?/, "number.float"],
          [/0[xX][0-9a-fA-F]+/, "number.hex"],
          [/\d+/, "number"],

          // strings
          [/"([^"\\]|\\.)*$/, "string.invalid"], // non-teminated string
          [/"/, { token: "string.quote", bracket: "@open", next: "@string" }],

          // characters
          [/'[^\\']'/, "string"],
          [/(')(@escapes)(')/, ["string", "string.escape", "string"]],
          [/'/, "string.invalid"],
        ],

        string: [
          [/[^\\"]+/, "string"],
          [/@escapes/, "string.escape"],
          [/\\./, "string.escape.invalid"],
          [/"/, { token: "string.quote", bracket: "@close", next: "@pop" }],
        ],
      },
    });

    // Define a new theme that contains only rules that match this language
    monaco.editor.defineTheme("scillaLight", {
      base: "vs",
      inherit: true,
      rules: [
        { token: "comment", foreground: "808080" },
        { token: "constant", foreground: "#F5871F" },
        { token: "constructor", foreground: "#C82829" },
        { token: "keyword", foreground: "#8959A8" },
        { token: "operator", foreground: "#8959A8" },
        { token: "storage", foreground: "#8959A8", fontStyle: "italic" },
        { token: "type-keyword", foreground: "ff0000" },
        { token: "custom-error", foreground: "ff0000", fontStyle: "bold" },
        { token: "custom-notice", foreground: "FFA500" },
        { token: "custom-date", foreground: "008800" },
      ],
    });

    monaco.languages.registerHoverProvider("scilla", {
      provideHover: function (model, position) {
        const wordObject = model.getWordAtPosition(position);
        const map = {
          // keywords
          let:
            "**let:**  Give `f` the name `x` in the contract (`let x = f`). The binding of `x` to `f` is global and extends to the end of the contract.",
          contains:
            "**contains:**  In `contains m k` Is the key `k` associated with a value in the map `m`? Returns a `Bool`. The contains function is typically used in `library` functions.",
          delete:
            "**delete:** `delete m[k]` In-place remove operation, i.e., identical to `remove`, but without making a copy of `m`. `m` must refer to a contract field. Removal from nested maps is supported with the syntax `delete m[k1][k2][...]`. If any of the specified keys do not exist in the corresponding map, no action is taken. Note that in the case of a nested removal `delete m[k1][...][kn-1][kn]`, only the key-value association of `kn` is removed. The key-value bindings of `k` to `kn-1` will still exist.",
          put:
            "**put**: `put m k v` Insert a key `k` and a value `v` into a map `m`. Returns a new map which is a copy of the `m` but with `k` associated with `v`. The value of `m` is unchanged. The put function is typically used in library functions. Note that `put` makes a copy of `m` before inserting the key-value pair.",
          remove:
            "**remove m k:** `remove m k` Remove a key `k` and its associated value from the map `m`. Returns a new map which is a copy of `m` but with `k` being unassociated with a value. The value of m is unchanged. The remove function is typically used in library functions. Note that remove makes a copy of m before removing the key-value pair.",
          library:
            "**library:** The declarations of the contract's own library values and functions",
          import:
            "**import:** To use functions from the standard library in a contract, the relevant library file must be imported using the import declaration i.e `import ListUtils IntUtils`. The import declaration must occur immediately before the contract’s own library declaration ",
          contract:
            "**contract:** declares a contract i.e `contract: MyContract` ",
          event:
            '**event:** `event e` Emit a message `e` as an event. The following code emits an event with name `e_name`. `e = { _eventname : "e_name"; <entry>_2 ; <entry>_3 }; event e`',
          field:
            "**field:** `field vname_1 : vtype_1 = expr_1` Mutable variables represent the mutable state of the contract. They are also called fields. They are declared after the immutable variables, with each declaration prefixed with the keyword `field`",
          send:
            '**send:** `send msgs` Send a list of messages `msgs` where msgs can be `msg = { _tag : "setHello"; _recipient : contractAddress; _amount : Uint128 0; param : Uint32 0 };`',
          fun:
            "*fun:* `fun (x : T) => expr` A function that takes an input x of type T and returns the value to which expression expr evaluates.",
          transition:
            "**transition:** Transitions define the change in the state of the contract. These are defined with the keyword `transition` followed by the parameters to be passed. The definition ends with the `end` keyword. \n\n `transition foo (vname_1 : vtype_1, vname_2 : vtype_2, ...)	...	  end`",
          match:
            "**match:** `match` Matches a bound variable with patterns and evaluates the expression in that clause. i.e `match x with		| pattern_1 =>			  expression_1 ...				| pattern_2 =>				  expression_2 ...				| _ => (*Wildcard*)				  expression ...				end`",
          end: "**end:** closes a definition",
          with: "**with:** used with `match` i.e `match x with` ",
          builtin:
            "**builtin:** Perform built-in operations e.g `builtin add i1 i2`: Add integer values `i1` and `i2`. Returns an integer of the same type",
          procedure:
            "**procedure:** These are like transitions, but can only be called locally i.e can not be called by other contracts",

          //storage
          String:
            "`String`: literals in Scilla are expressed using a sequence of characters enclosed in double quotes. Variables can be declared by specifying using keyword `String`",
          Uint32: "`Uint32`: 32 bit integer type",
          Uint64: "`Uint64`: 64 bit integer type",
          Uint128: "`Uint128`: 128 bit integer type",
          Uint256: "`Uint256`: 256 bit integer type",
          Int32: "`Int32`: 32 bit integer type",
          Int64: "`Int64`: 64 bit integer type",
          Int128: "`Int128`: 128 bit integer type",
          Int256: "`Int256`: 256 bit integer type",
          Map:
            "`Map`: A value of type `Map kt vt` provides a key-value store where `kt` is the type of keys and `vt` is the type of values.",
          True: "`True`: Value of Boolean type",
          False: "`False`: Value of Boolean type",
          ByStr20:
            "`ByStr20`: Used to declare addreses. Represents a hexadecimal byte string of 20 bytes (40 hexadecimal characters). A `ByStr20` literal is prefixed with `0x`",
          ByStr32:
            "`ByStr32`: A hash in Scilla is declared using the data type `ByStr32`. A `ByStr32` represents a hexadecimal byte string of 32 bytes (64 hexadecimal characters). A `ByStr32` literal is prefixed with `0x`",
          ByStr64: "`ByStr64`: Used to declare digital signtures.",
          ByStr33: "`ByStr33`: Used to declare Schnorr public key",
          BNum:
            "`BNum`: Block numbers have a dedicated type `BNum` in Scilla. Variables of this type are specified with the keyword `BNum` followed by an integer value (for example `BNum 101`)",
          Option:
            "`Optional`: Optional values are specified using the type `Option t`	, where `t` is some type. The `Option` ADT has two constructors:	Some represents the presence of a value. The `Some` constructor takes one argument (the `value`, of type `t`). `None` represents the absence of a value. The `None` constructor takes no arguments.",
          None:
            "`None`: Constructor from `Option`. Represents the absence of a value. The `None` constructor takes no arguments.",
          Bool: "`Bool`: Boolean values are specified using the type Bool",
          Some:
            "`Some`: Constructor from `Option` takes one argument (the `value`, of type `t`)",
          List:
            "Lists of values are specified using the type List t, where t is some type. The List ADT has two constructors: Nil represents an empty list. The Nil constructor takes no arguments.	Cons represents a non-empty list. The Cons constructor takes two arguments: The first element of the list (of type t), and another list (of type List t) representing the rest of the list.	",
          Cons:
            "`Cons`: Represents a non-empty list. The `Cons` constructor takes two arguments: The first element of the list (of type `t`), and another list (of type `List t`) representing the rest of the list.",
          Pair:
            "Pairs of values are specified using the type `Pair t1 t2`, where `t1` and `t2` are types. The `Pair` ADT has one constructor:	`Pair` represents a pair of values. The Pair constructor takes two arguments, namely the two values of the pair, of types `t1` and `t2`, respectively.",
          type: "`type`: used to declare a type",
          scilla_version:
            "`scilla_version`: The contract starts with the declaration of `scilla_version`, which indicates which major Scilla version the contract uses.",
          Zero:
            "`Zero`: Represents the number `0`. The `Zero` constructor takes no arguments..",
          Succ:
            "`Succ`:  Represents the successor of another Peano number. The `Succ` constructor takes one argument (of type `Nat`) which represents the Peano number that is one less than the current number.",

          //operations
          eq:
            "_eq_: Equality operator `builtin eq i1 i2` Is i1 equal to i2? Returns a Bool",
          add:
            "_add_: In `builtin add i1 i2` Add integer values i1 and i2. Returns an integer of the same type.",
          sub:
            "_sub_: `builtin sub i1 i2` Subtract `i2` from `i1`. Returns an integer of the same type.",
          mul:
            "_mul_: `builtin mul i1 i2`, Integer product of `i1` and `i2`. Returns an integer of the same type.",
          div:
            "_div_: `builtin div i1 i2` Integer division of `i1` by `i2`. Returns an integer of the same type.",
          rem:
            "_rem_: `builtin rem i1 i2`: The remainder of integer division of `i1` by `i2`. Returns an integer of the same type.",
          lt:
            "_lt_: `builtin lt i1 i2` Is `i1` less than `i2`? Returns a `Bool`",
          blt: "_blt_: `blt b1 b2`, Is `b1` less than `b2`? Returns a `Bool`",
          in: "_in_: Used after the `let` keyword",
          substr:
            "_substr_: `builtin substr s1 i1 i2`, Extract the substring of `s1` of length `i2` starting from position `i1` with length. `i1` and `i2` must be of type `Uint32`. Character indices in strings start from `0`. Returns a `String`",
          sha256hash:
            "_sha256hash_: `builtin sha256hash x`, Convert `x` of Any type to its SHA256 hash. Returns a `ByStr32`",
          keccak256hash:
            "_keccak256hash_: `builtin keccak256hash x`, Convert `x` of Any type to its Keccak256 hash. Returns a `ByStr32`",
          ripemd160hash:
            "_ripemd160hash_: `builtin ripemd160hash x` Convert `x` of Any type to its RIPEMD-160 hash. Returns a `ByStr16`",
          to_byStr:
            "_to_byStr_: `builtin to_byStr x` Convert a hash `x` of type ByStrX (for some known X) to one of arbitrary length of type `ByStr`",
          to_nat:
            "_to_nat_: `builtin to_nat i1`, Convert a value of type `Uint32` to the equivalent value of type `Nat`",
          pow:
            "_pow_: `builtin pow i1 i2`, `i1` raised to the power of `i2`. Returns an integer of the same type as `i1`",
          to_uint256:
            "_to_uint256_: `builtin to_uint256 x`, Convert a hash x to the equivalent value of type `Uint256`. x must be of type ByStrX for some known X less than or equal to 32",
          to_uint32:
            "_to_uint32_: `builtin to_uint36 x`, Convert a hash `x` to the equivalent value of type `Uint32`. x must be of type ByStrX for some known X less than or equal to 32",
          to_uint64:
            "_to_uint64_: `builtin to_uint64 x`, Convert a hash x to the equivalent value of type `Uint64`. x must be of type ByStrX for some known X less than or equal to 64",
          to_uint128:
            "_to_uint128_: `builtin to_uint128 x`,  Convert a hash x to the equivalent value of type `Uint128`. x must be of type ByStrX for some known X less than or equal to 128",
          to_int256:
            "_to_int256_: `builtin to_int256 x,` Convert a hash x to the equivalent value of type `Uint256`. x must be of type ByStrX for some known X less than or equal to 32",
          to_int32:
            "_to_int32_: `builtin to_int32 x`, Convert a hash x to the equivalent value of type `Int32`. x must be of type ByStrX for some known X less than or equal to 32",
          to_int64:
            "_to_int64_: `builtin to_int64 x`, Convert a hash x to the equivalent value of type `Int64`. x must be of type ByStrX for some known X less than or equal to 64",
          to_list:
            "_to_list_: Equality operator `builtin eq i1 i2` Is i1 equal to i2? Returns a Bool",
          to_int128:
            "_to_int128_: `builtin to_int64 x`, Convert a hash x to the equivalent value of type `Int128`. x must be of type ByStrX for some known X less than or equal to 128",
          schnorr_verify:
            "_schnorr_verify_: `builtin schnorr_verify pubk x sig` Verify a signature sig of type `ByStr64` against a hash `x` of type `ByStr32` with the Schnorr public key pubk of type `ByStr33`",
          concat:
            "_concat_: `concat x1 x2` Concatenate the hashes `x1` and `x2`. If x1 has type ByStrX and x2 has type ByStrY, then the result will have type `ByStr(X+Y)`",
        };
        return {
          contents: [{ value: map[wordObject.word] }],
        };
      },
    });

    this.editor = monaco.editor.create(el, {
      theme: "scillaLight",
      value: this.file.code,
      language: "scilla",
    });
  },
};
</script>

<style lang="scss" scoped>
.editor {
  height: calc(100% - 28px); // - tabs height

  .ace_scrollbar.ace_scrollbar-h {
    display: none !important;
  }

  .actions-bar {
    padding: 0.5rem;
    padding-left: 0;
    font-size: 0.85rem;
    height: 50px;
  }

  .editor-inner {
    height: calc(100% - 50px);
    overflow-y: scroll;
  }

  .btn {
    font-family: "Montserrat", sans-serif;

    color: #000;
    font-weight: 500;
    font-size: 0.85rem;

    background-color: lighten($primary, 40);

    &:hover {
      background-color: rgba(0, 0, 0, 0.1);
      text-decoration: none;
    }

    img {
      height: 1rem;
    }
  }
}
</style>