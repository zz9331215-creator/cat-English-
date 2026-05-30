const { getStore, getStageByExp, initStore, STORAGE_KEY } = require('../../utils/store')
const TEXT = require('../../utils/texts')

Page({
  data: {
    t: TEXT,
    user: {},
    pet: {},
    stats: {},
    settings: {},
    catStrips: 0,
    stageName: '',
    studyDays: 0
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 4 })
    }
    this.loadProfile()
  },

  loadProfile() {
    const store = getStore()
    const stage = getStageByExp(store.pet.exp)
    const studyDays = Object.keys(store.stats.dailyRecords).length

    this.setData({
      user: store.user,
      pet: store.pet,
      stats: store.stats,
      settings: store.settings,
      catStrips: store.currency.catStrips,
      stageName: stage.name,
      studyDays
    })
  },

  resetData() {
    wx.showModal({
      title: TEXT.resetTitle,
      content: TEXT.resetContent,
      confirmColor: '#FF6B6B',
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync(STORAGE_KEY)
          initStore()
          this.loadProfile()
          wx.showToast({ title: TEXT.resetDone, icon: 'success' })
        }
      }
    })
  }
})
