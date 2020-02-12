const state = {
    selected: null,
    events: []
};

const getters = {
    selected: state => state.selected,
    list: state => state.events.reverse()
};

const actions = {
    AddEvents({ commit }, eventsList) {
        eventsList.map(ev => {
            commit('add', ev);
        });
    },
};


const mutations = {
    select(state, payload) {
        state.selected = payload;
    },
    add(state, payload) {
        state.events.push(payload);
    },
    remove(state, { index }) {
        state.events.splice(index, 1);
    }
};


export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}