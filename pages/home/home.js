const { getStore, feedPet, decaySatiety, getStageByExp, getPetSpeech } = require('../../utils/store')
const { getProgressPercent } = require('../../utils/util')

Page({
  data: {
    pet: {},
    catStrips: 0,
    stageName: '幼猫期',
    growthPercent: 0,
    speechText: '',
    showSpeech: true,
    kittenAction: 'idle',
    showReward: false,
    rewardExp: 0,
    stageUp: false,
    kittenWidth: 280,
    kittenHeight: 320
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 2 })
    }
    this.refreshData()
    this.startSpeechTimer()
  },

  onHide() {
    if (this.speechTimer) clearInterval(this.speechTimer)
    if (this.eatingTimer) clearTimeout(this.eatingTimer)
  },

  refreshData() {
    decaySatiety()
    const store = getStore()
    const stage = getStageByExp(store.pet.exp)
    const growthPercent = getProgressPercent(
      store.pet.exp - stage.minExp,
      stage.maxExp - stage.minExp
    )

    this.setData({
      pet: store.pet,
      catStrips: store.currency.catStrips,
      stageName: stage.name,
      growthPercent,
      speechText: getPetSpeech(store.pet),
      kittenWidth: Math.round(280 * store.pet.size),
      kittenHeight: Math.round(320 * store.pet.size)
    })
  },

  startSpeechTimer() {
    if (this.speechTimer) clearInterval(this.speechTimer)
    this.speechTimer = setInterval(() => {
      const store = getStore()
      this.setData({ speechText: getPetSpeech(store.pet) })
    }, 8000)
  },

  feedKitten() {
    const oldStage = getStageByExp(getStore().pet.exp).name
    const result = feedPet(1)

    if (!result.success) {
      wx.showToast({ title: result.message, icon: 'none' })
      return
    }

    this.setData({ kittenAction: 'eating' })

    this.eatingTimer = setTimeout(() => {
      this.setData({ kittenAction: 'idle' })
      this.refreshData()
    }, 2000)

    const newStage = result.stage
    this.setData({
      showReward: true,
      rewardExp: result.expGain,
      stageUp: oldStage !== newStage
    })

    wx.vibrateShort({ type: 'light' })
  },

  closeReward() {
    this.setData({ showReward: false })
    this.refreshData()
  },

  goLearn() {
    wx.switchTab({ url: '/pages/focus/focus' })
  },

  goWords() {
    wx.navigateTo({ url: '/pages/words/words' })
  },

  goSpeaking() {
    wx.navigateTo({ url: '/pages/speaking/speaking' })
  },

  goShop() {
    wx.navigateTo({ url: '/pages/shop/shop' })
  }
})
