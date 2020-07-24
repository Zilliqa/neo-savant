import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersist from 'vuex-persist'

import accounts from './modules/accounts'
import networks from './modules/networks'
import files from './modules/files'
import contracts from './modules/contracts'
import events from './modules/events'
import general from './modules/general'
import transactions from './modules/transactions'
// import console from './modules/console'

Vue.use(Vuex)

const vuexPersist = new VuexPersist({
  key: 'savant-ide',
  storage: window.localStorage,
  reducer: state => ({
    accounts: state.accounts,
    contracts: state.contracts,
    events: state.events,
    files: state.files,
    general: {
      editor: state.general.editor
    },
    networks: state.networks,
    transactions: state.transactions
    // getRidOfThisModule: state.getRidOfThisModule (No one likes it.)
  })
})

export default new Vuex.Store({
  modules: {
    accounts,
    networks,
    files,
    contracts,
    events,
    general,
    transactions
    // console
  },
  plugins: [vuexPersist.plugin]
})
