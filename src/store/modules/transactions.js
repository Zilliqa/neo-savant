const state = {
    current: undefined,
    transactions: [],
    watcher: []
};

const getters = {
    current: state => state.current,
    list: state => state.transactions,
    watcherList: state => state.watcher
};

const actions = {
    async AddTx({ commit, rootGetters }, txData) {
        const network = rootGetters['networks/selected'];

        commit('add', { ...txData, network: network.url, timestamp: Date.now() });
        commit('addToWatcher', { ...txData, network: network.url, timestamp: Date.now() });
    },
    /* async UpdateWatcherTx({commit,state, rootGetters}, txData) {
        const tx = state.watcherList.find(tx => tx.id === txData.id);

        if(tx !== undefined) {
            
        }
    } */
};


const mutations = {
    add(state, payload) {
        state.transactions.push(payload);
    },
    addToWatcher(state, payload) {
        state.watcher.push(payload);
    },
};


export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}