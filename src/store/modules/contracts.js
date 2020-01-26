const state = {
    selected: null,
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
    }
};


const mutations = {
    select(state, payload) {
        state.selected = payload;
    },
    addContract(state, payload) {
        state.contracts.push(payload);
    }
};


export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}