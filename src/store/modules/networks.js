const state = {
    selected: undefined,
    networks: [
        {
            name: 'Simulated ENV',
            url: process.env.VUE_APP_ISOLATED_URL,
            chainId: 222,
            msgVersion: 1
        },
        {
            name: 'Testnet',
            url: 'https://dev-api.zilliqa.com',
            chainId: 333,
            msgVersion: 1
        },
        {
            name: 'Mainnet',
            url: 'https://api.zilliqa.com',
            chainId: 1,
            msgVersion: 1
        }
    ]
};

const getters = {
    selected: state => state.selected,
    list: state => state.networks
};

const actions = {
    SelectNetwork({ commit, state }, { url }) {
        const network = state.networks.find(function (item) {
            return item.url === url
        });

        commit('setNetwork', network);
        commit('accounts/setAccount', undefined, { root: true });
        window.EventBus.$emit('refresh-balance');
    },
    AddNetwork({ commit, state, dispatch }, networkDetails) {

        if (state.networks.find(item => item.url === networkDetails.url) !== undefined) {
            throw new Error("Network already exists.");
        }

        commit('addNetwork', networkDetails)
        dispatch('SelectNetwork', networkDetails.url);
    }
};


const mutations = {
    setNetwork(state, payload) {
        state.selected = payload;
    },
    addNetwork(state, payload) {
        state.networks.push(payload);
    }
};


export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}