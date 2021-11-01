// Copyright (C) 2020 Zilliqa

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https:www.gnu.org/licenses/>.

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