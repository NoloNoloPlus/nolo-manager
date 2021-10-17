export const state = () => ({
    userTokens: null
})

export const mutations = {
    setUserTokens(state, userTokens) {
        state.userTokens = userTokens
    }
}