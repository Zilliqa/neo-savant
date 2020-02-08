const state = {
    selected: {
        name: 'Mainnet',
        url: 'https://api.zilliqa.com',
        chainId: 1,
        msgVersion: 1
    },
    networks: [
        {
            name: 'Mainnet',
            url: 'https://api.zilliqa.com',
            chainId: 1,
            msgVersion: 1
        },
        {
            name: 'Testnet',
            url: 'https://dev-api.zilliqa.com',
            chainId: 333,
            msgVersion: 1
        },
        {
            name: 'Simulated ENV',
            url: 'http://35.207.129.232:5555/',
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
    SelectNetwork({ commit, state }, {url}) {
        const network = state.networks.find(function (item) {
            return item.url === url
        });

        commit('setNetwork', network);
    }
};


const mutations = {
    setNetwork(state, payload) {
        state.selected = payload;
    },
};


export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}