const { initStore, getStore } = require('./utils/store')

App({
  onLaunch() {
    initStore()
    const store = getStore()
    this.globalData.store = store
    this.globalData.userInfo = store.user
    this.globalData.pet = store.pet
  },

  globalData: {
    store: null,
    userInfo: null,
    pet: null
  }
})
