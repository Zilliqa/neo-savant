const state = {
    selected: undefined,
    contracts: []
};

const getters = {
    selected: state => state.selected,
    list: (state, getters, rootState, rootGetters) => {
        const network = rootGetters['networks/selected'];

        return state.contracts.filter(contract => contract.network === network.url);
    }
};

const actions = {
    SelectContract({ commit, state, rootGetters }, { contractId }) {
        const network = rootGetters['networks/selected'];

        if (network.url === undefined) {
            throw Error('Network not selected');
        }

        const contract = state.contracts.find(function (item) {
            return (item.network === network.url && item.contractId === contractId)
        });

        if (contract === undefined) {
            throw Error('Contract does not exist on network.');
        }

        commit('files/unselect', null, { root: true })
        commit('select', contract);
    },
    AddContract({ commit, state, rootGetters }, contract) {
        const network = rootGetters['networks/selected'];

        if (network.url === undefined) {
            throw Error('Network not selected');
        }

        const exists = state.contracts.find(function (item) {
            return (item.network === network.url && item.contractId === contract.contractId)
        });

        if (exists !== undefined) {
            throw Error('Contract already imported.');
        }

        commit('addContract', { ...contract, network: network.url })
    },
    RemoveContract({ commit, state, rootGetters }, { id }) {

        const network = rootGetters['networks/selected'];
        const contract = state.contracts.findIndex(function (item) {
            return (item.network === network.url && item.contractId === id)
        });

        if (contract === undefined) {
            throw Error('Contract not found.');
        }

        if (state.selected && id === state.selected.contractId) {
            commit('unselect');
        }

        commit('remove', { index: contract });
    }
};


const mutations = {
    select(state, payload) {
        state.selected = payload;
    },
    unselect(state) {
        state.selected = undefined;
    },
    addContract(state, payload) {
        state.contracts.push(payload);
    },
    remove(state, payload) {
        state.contracts.splice(payload.index, 1);
    }
};


export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}