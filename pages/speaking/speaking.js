const { getRandomTopic } = require('../../utils/words-data')
const { completeLearning } = require('../../utils/store')
const { formatTime } = require('../../utils/util')
const TEXT = require('../../utils/texts')

Page({
  data: {
    t: TEXT,
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
      wx.showToast({ title: TEXT.speakingRecordFail, icon: 'none' })
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

  finishPractice() {
    if (this.data.isRecording) {
      this.stopRecord()
      return
    }
    if (this.data.seconds > 0) {
      this.onRecordComplete()
    }
  },

  onRecordComplete() {
    const minutes = Math.max(1, Math.ceil(this.data.seconds / 60))
    const result = completeLearning('speaking', minutes)

    wx.showModal({
      title: TEXT.speakingCompleteTitle,
      content: TEXT.format(TEXT.speakingCompleteContent, {
        time: this.data.timerDisplay,
        strips: result.stripsReward
      }),
      confirmText: TEXT.focusConfirmFeed,
      cancelText: TEXT.speakingContinue,
      success: (res) => {
        if (res.confirm) {
          wx.switchTab({ url: '/pages/home/home' })
        }
        this.setData({ seconds: 0, timerDisplay: '00:00' })
      }
    })
  }
})
