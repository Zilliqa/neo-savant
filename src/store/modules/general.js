const state = {
  mainPanel: null,
  leftPanel: "files",
  appVersion: process.env.PACKAGE_VERSION || "0",
  editor: {
    fontSize: 14,
  },
};

const getters = {
  mainPanel: (state) => state.mainPanel,
  editor: (state) => state.editor,
  leftPanel: (state) => state.leftPanel,
  appVersion: (state) => {
    return state.appVersion;
  },
};

const actions = {
  ChangeFontSize({ commit }, { fontSize }) {
    commit("updateFontSize", fontSize);
  },
  OpenLeftPanel({ commit, state }, payload) {
    if (payload !== state.leftPanel) {
      commit("openLeftPanel", payload);
    } else {
      commit("openLeftPanel", false);
    }
  },
};

const mutations = {
  updateFontSize(state, payload) {
    state.editor.fontSize = payload;
  },
  openLeftPanel(state, payload) {
    state.leftPanel = payload;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
