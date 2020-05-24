const state = {
    mainPanel: null,
    appVersion: process.env.PACKAGE_VERSION || '0',
    editor: {
        fontSize: 14
    }
};

const getters = {
    mainPanel: state => state.mainPanel,
    editor: state => state.editor,
    appVersion: (state) => {
        return state.appVersion
    }
};

const actions = {
    ChangeFontSize({ commit }, { fontSize }) {
        commit('updateFontSize', fontSize);
    },
};


const mutations = {
    updateFontSize(state, payload) {
        state.editor.fontSize = payload;
    }
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}