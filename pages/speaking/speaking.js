const { getRandomTopic } = require('../../utils/words-data')
const { completeLearning } = require('../../utils/store')
const { formatTime } = require('../../utils/util')

Page({
  data: {
    topic: {},
    isRecording: false,
    seconds: 0,
    timerDisplay: '00:00'
  },

  timer: null,
  recorderManager: null,

  onLoad() {
    this.setData({ topic: getRandomTopic() })
    this.initRecorder()
  },

  onUnload() {
    this.stopRecord()
  },

  initRecorder() {
    this.recorderManager = wx.getRecorderManager()
    this.recorderManager.onStop(() => {
      this.onRecordComplete()
    })
    this.recorderManager.onError(() => {
      wx.showToast({ title: '录音失败', icon: 'none' })
      this.stopRecord()
    })
  },

  changeTopic() {
    this.setData({ topic: getRandomTopic() })
  },

  toggleRecord() {
    if (this.data.isRecording) {
      this.stopRecord()
    } else {
      this.startRecord()
    }
  },

  startRecord() {
    this.setData({ isRecording: true, seconds: 0, timerDisplay: '00:00' })

    this.recorderManager.start({
      duration: 600000,
      format: 'mp3'
    })

    this.timer = setInterval(() => {
      const seconds = this.data.seconds + 1
      this.setData({
        seconds,
        timerDisplay: formatTime(seconds)
      })
    }, 1000)
  },

  stopRecord() {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
    if (this.data.isRecording) {
      this.recorderManager.stop()
    }
    this.setData({ isRecording: false })
  },

  onRecordComplete() {
    const minutes = Math.max(1, Math.ceil(this.data.seconds / 60))
    const result = completeLearning('speaking', minutes)

    wx.showModal({
      title: '口语练习完成！',
      content: `练习了 ${this.data.timerDisplay}，获得 ${result.stripsReward} 条猫条！`,
      confirmText: '去喂猫',
      cancelText: '继续练习',
      success: (res) => {
        if (res.confirm) {
          wx.switchTab({ url: '/pages/home/home' })
        }
        this.setData({ seconds: 0, timerDisplay: '00:00' })
      }
    })
  }
})
