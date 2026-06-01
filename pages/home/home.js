const { getStore, saveStore, feedPet, decaySatiety, getStageByExp, getPetSpeech, getPetAction } = require('../../utils/store')
const TEXT = require('../../utils/texts')

function calcCatImageWidth(size) {
  const base = 320
  const s = Number(size) || 0.72
  return Math.round(base * Math.max(0.55, Math.min(1.35, s)))
}

Page({
  data: {
    t: TEXT,
    pet: {
      stage: 'baby',
      exp: 0,
      maxExp: 200,
      satiety: 80,
      mood: 'happy',
      size: 0.55
    },
    catStrips: 0,
    stageName: TEXT.stageBaby,
    growthPercent: 0,
    speechText: '',
    showSpeech: true,
    kittenAction: 'idle',
    petDisplaySize: 1,
    catImageWidth: 280,
    showReward: false,
    rewardExp: 0,
    stageUp: false
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
    if (this.poseTimer) clearInterval(this.poseTimer)
    if (this.eatingTimer) clearTimeout(this.eatingTimer)
  },

  refreshData() {
    decaySatiety()
    const store = getStore()
    const stage = getStageByExp(store.pet.exp)
    const growthPercent = Math.min(
      100,
      Math.round(((store.pet.exp - stage.minExp) / (stage.maxExp - stage.minExp)) * 100)
    )

    const kittenAction =
      this.data.kittenAction === 'eating' ? 'eating' : getPetAction(store.pet)

    const petDisplaySize = Number(store.pet.size) || stage.size || 1

    this.setData({
      t: TEXT,
      pet: store.pet,
      catStrips: store.currency.catStrips,
      stageName: stage.name,
      growthPercent: isNaN(growthPercent) ? 0 : growthPercent,
      speechText: getPetSpeech(store.pet),
      kittenAction,
      petDisplaySize,
      catImageWidth: calcCatImageWidth(petDisplaySize)
    })
  },

  startSpeechTimer() {
    if (this.speechTimer) clearInterval(this.speechTimer)
    if (this.poseTimer) clearInterval(this.poseTimer)
    this.poseAlt = false

    this.speechTimer = setInterval(() => {
      const store = getStore()
      this.setData({ speechText: getPetSpeech(store.pet) })
    }, 8000)

    this.poseTimer = setInterval(() => {
      if (this.data.kittenAction === 'eating') return
      const store = getStore()
      const pet = store.pet
      let kittenAction = getPetAction(pet)
      if (pet.satiety >= 85 && pet.mood !== 'hungry') {
        this.poseAlt = !this.poseAlt
        kittenAction = this.poseAlt ? 'lying' : 'full'
      }
      this.setData({ kittenAction })
    }, 10000)
  },

  onKittenTap() {
    if (this.data.kittenAction === 'eating') return
    const store = getStore()
    const pet = store.pet
    let next = 'lying'
    if (pet.satiety < 30) next = 'hungry'
    else if (pet.satiety >= 85) {
      next = this.data.kittenAction === 'full' ? 'lying' : 'full'
    } else {
      next = this.data.kittenAction === 'lying' ? 'idle' : 'lying'
    }
    this.setData({ kittenAction: next })
  },

  feedKitten() {
    const oldStage = getStageByExp(getStore().pet.exp).key
    const result = feedPet(1)

    if (!result.success) {
      wx.showToast({ title: result.message, icon: 'none' })
      return
    }

    this.setData({ kittenAction: 'eating' })

    this.eatingTimer = setTimeout(() => {
      const store = getStore()
      store.pet.mood = store.pet.satiety >= 85 ? 'happy' : 'normal'
      saveStore(store)
      this.setData({ kittenAction: 'idle' })
      this.refreshData()
    }, 2000)

    this.setData({
      showReward: true,
      rewardExp: result.expGain,
      stageUp: oldStage !== result.stageKey
    })

    wx.vibrateShort({ type: 'light' })
  },

  closeReward() {
    this.setData({ showReward: false })
    this.refreshData()
  },

  onHungryAction() {
    if (this.data.catStrips > 0) this.feedKitten()
    else this.goLearn()
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
