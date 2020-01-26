const state = {
    selected: null,
    accounts: [
        {
            address: '0x815A803f6915bcB9D636718FA267832bb8fBc605',
            keystore: { "address": "0x815A803f6915bcB9D636718FA267832bb8fBc605", "crypto": { "cipher": "aes-128-ctr", "cipherparams": { "iv": "abb5db1f357bae8a8404f39415a8cac8" }, "ciphertext": "6e6c021f24652edb5780066e76289e49ec7f3c16d4ff941360e54bad0116a49b", "kdf": "scrypt", "kdfparams": { "salt": "eceb48b5edadd715e91f5b6fe0ec50ddec721e9ad040227a6289ded9179b2f63", "n": 8192, "c": 262144, "r": 8, "p": 1, "dklen": 32 }, "mac": "87a885d50931984ce783a076a69e316e4bbd96a3bd90dd57781135797707aed5" }, "id": "36663863-3737-4735-b836-313731623362", "version": 3 },
            network: 'https://dev-api.zilliqa.com',
            type: 'keystore'
        }
    ]
};

const getters = {
    selected: state => state.selected,
    list: (state, getters, rootState, rootGetters) => {
        const network = rootGetters['networks/selected'];

        return state.accounts.filter(account => account.network === network.url);
    }
};

const actions = {
    SelectAccount({ commit, state, rootGetters }, { address }) {
        const network = rootGetters['networks/selected'];

        if (network.url === undefined) {
            throw Error('Network not selected');
        }

        const account = state.accounts.find(function (item) {
            return (item.network === network.url && item.address === address)
        });

        if (account === undefined) {
            throw Error('Account does not exist on network.');
        }

        commit('setAccount', account);
    },
    AddAccount({ commit, state, rootGetters }, account) {
        const network = rootGetters['networks/selected'];

        if (network.url === undefined) {
            throw Error('Network not selected');
        }

        const exists = state.accounts.find(function (item) {
            return (item.network === network.url && item.address === account.address)
        });

        if (exists !== undefined) {
            throw Error('Account already exists on network.');
        }

        commit('addAccount', { ...account, network: network.url })
    }
};


const mutations = {
    setAccount(state, payload) {
        state.selected = payload;
    },
    addAccount(state, payload) {
        state.accounts.push(payload);
    }
};


export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}