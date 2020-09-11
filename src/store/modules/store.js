const store = {
    state:{
        hotSearchOffsetY:0
    },
    mutations: {
        'SET_HOT_SEARCH_OFFSETY': (state, hotSearchOffsetY) => {
          state.hotSearchOffsetY = hotSearchOffsetY
        },
    }
}

export default store;