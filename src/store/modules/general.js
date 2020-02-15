import uuidv4 from 'uuid';

const state = {
    mainPanel: null
};

const getters = {
    mainPanel: state => state.mainPanel
};

const actions = {
    SelectFile({ commit, state }, { id }) {
        const file = state.files.find(function (item) {
            return item.id === id
        });

        commit('select', file);
    },
    CreateFile({ commit }) {
        const id = uuidv4();

        commit('add', { id, name: 'untitled.scilla', code: '' });
    },
    RenameFile({ commit, state }, { id, name }) {
        const file = state.files.findIndex(item => item.id === id);

        if (file === undefined) {
            throw Error('File not found.');
        }

        commit('rename', { index: file, name: name });
    },
    UpdateCode({ commit, state }, { id, code }) {
        const file = state.files.findIndex(item => item.id === id);

        if (file === undefined) {
            throw Error('File not found.');
        }

        commit('updateCode', { index: file, code: code });
    },
    RemoveFile({ commit, state }, { id }) {
        const file = state.files.findIndex(item => item.id === id);

        if (file === undefined) {
            throw Error('File not found.');
        }

        commit('remove', { index: file });
    }
};


const mutations = {
    select(state, payload) {
        state.selected = payload;
    },
    add(state, payload) {
        state.files.push(payload);
    },
    rename(state, payload) {
        state.files[payload.index].name = payload.name;
    },
    updateCode(state, payload) {
        state.files[payload.index].code = payload.code;
    },
    remove(state, payload) {
        state.files.splice(payload.index, 1);
    }
};


export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}