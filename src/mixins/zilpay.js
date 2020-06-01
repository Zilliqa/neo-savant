import { mapGetters } from "vuex";

export default {
  data() {
    return {
      observableNetwork: null,
      observableAccount: null
    }
  },
  computed: {
    ...mapGetters("networks", { network: "selected" }),
    ...mapGetters("networks", ["list"]),
    ...mapGetters("accounts", { acountsList: "list" }),

    /**
     * to ZilPay network nameing.
     */
    net() {
      return {
        mainnet: this.list[2],
        private: this.list[0],
        testnet: this.list[1]
      }
    }
  },
  methods: {
    /**
     * When page has loaded.
     */
    _isLoadTab() {
      return new Promise((resolve) => {
        if (window.document.readyState === 'complete') {
          resolve(true)
        }
        window.onload = function () {
          setTimeout(() => resolve(true), 1000)
        }
      })
    },
    /**
     * Testing for ZilPay inject script.
     */
    async testZilPay() {
      await this._isLoadTab()

      if (typeof window.zilPay === 'undefined') {
        throw new Error('ZilPay is not installed!')
      }

      if (!window.zilPay.wallet.isConnect) {
        return window.zilPay.wallet.connect()
      }
    },
    /**
     * Start observable ZilPay network and accounts.
     */
    async runZilPayObservable() {
      await this.testZilPay()

      const { wallet } = window.zilPay

      if (this.observableNetwork && !this.observableNetwork.isStopped) {
        this.observableNetwork.unsubscribe()
      }

      if (this.observableAccount && !this.observableAccount.isStopped) {
        this.observableAccount.unsubscribe()
      }

      this.observableNetwork = wallet.observableNetwork().subscribe(async () => {
        await this.getZilPayNetwork()
        this.getZilPayAccount()
      });
      this.observableAccount = wallet.observableAccount().subscribe(() => {
        this.getZilPayAccount()
      });
    },
    /**
     * Get and update network.
     */
    async getZilPayNetwork() {
      await this.testZilPay()

      const { wallet } = window.zilPay

      await this.$store.dispatch("networks/SelectNetwork", this.net[wallet.net]);
      window.EventBus.$emit("refresh-balance");
    },
    /**
     * Get, create, update accounts.
     */
    async getZilPayAccount() {
      await this.testZilPay()

      const { wallet } = window.zilPay
      const account = wallet.defaultAccount
      const hasAccount = this.acountsList.some((acc) => account.base16 === acc.address)

      if (hasAccount) {
        this.$store.dispatch("accounts/SelectAccount", { address: account.base16 });
      } else {
        await this.$store.dispatch("accounts/AddAccount", {
          address: wallet.defaultAccount.base16,
          type: "zilpay"
        });
        this.$notify({
          group: "scilla",
          type: "success",
          position: "bottom right",
          title: "Accounts",
          text: "Account successfully imported"
        });
      }

      window.EventBus.$emit("refresh-balance");
    }
  }
}
