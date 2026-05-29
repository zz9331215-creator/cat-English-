const { getStore, completeLearning } = require('../../utils/store')
const { formatTime, getProgressPercent } = require('../../utils/util')

Page({
  data: {
    totalSeconds: 25 * 60,
    remainingSeconds: 25 * 60,
    timerDisplay: '25:00',
    isRunning: false,
    progressPercent: 0,
    learnType: 'words',
    expectedReward: 3,
    onlineCount: 546
  },

  timer: null,

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 0 })
    }
    const store = getStore()
    const duration = store.settings.focusDuration || 25
    this.setData({
      totalSeconds: duration * 60,
      remainingSeconds: duration * 60,
      timerDisplay: formatTime(duration * 60),
      onlineCount: 400 + Math.floor(Math.random() * 300)
    })
  },

  onHide() {
    this.pauseTimer()
  },

  onUnload() {
    this.pauseTimer()
  },

  selectType(e) {
    const type = e.currentTarget.dataset.type
    this.setData({
      learnType: type,
      expectedReward: type === 'words' ? 5 : 3
    })
  },

  toggleTimer() {
    if (this.data.isRunning) {
      this.pauseTimer()
    } else {
      this.startTimer()
    }
  },

  startTimer() {
    this.setData({ isRunning: true })
    this.timer = setInterval(() => {
      let remaining = this.data.remainingSeconds - 1
      if (remaining <= 0) {
        this.completeSession()
        return
      }
      const total = this.data.totalSeconds
      this.setData({
        remainingSeconds: remaining,
        timerDisplay: formatTime(remaining),
        progressPercent: getProgressPercent(total - remaining, total)
      })
    }, 1000)
  },

  pauseTimer() {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
    this.setData({ isRunning: false })
  },

  completeSession() {
    this.pauseTimer()
    const minutes = Math.ceil(this.data.totalSeconds / 60)
    const type = this.data.learnType
    const result = completeLearning(type === 'words' ? 'focus' : 'speaking', minutes)

    wx.showModal({
      title: '专注完成！',
      content: `太棒了！你获得了 ${result.stripsReward} 条猫条，快去喂咪咪吧~`,
      confirmText: '去喂猫',
      cancelText: '继续学习',
      success: (res) => {
        if (res.confirm) {
          wx.switchTab({ url: '/pages/home/home' })
        }
        this.resetTimer()
      }
    })
  },

  resetTimer() {
    const total = this.data.totalSeconds
    this.setData({
      remainingSeconds: total,
      timerDisplay: formatTime(total),
      progressPercent: 0,
      isRunning: false
    })
  },

  quickFeed() {
    wx.switchTab({ url: '/pages/home/home' })
  },

  goWords() {
    wx.navigateTo({ url: '/pages/words/words' })
  },

  goSpeaking() {
    wx.navigateTo({ url: '/pages/speaking/speaking' })
  },

  goHome() {
    wx.switchTab({ url: '/pages/home/home' })
  }
})
