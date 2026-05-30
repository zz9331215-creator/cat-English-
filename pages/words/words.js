const { getDailyWords } = require('../../utils/words-data')
const { completeLearning, getStore } = require('../../utils/store')
const { getProgressPercent } = require('../../utils/util')
const { playWord, enrichWord } = require('../../utils/audio')
const TEXT = require('../../utils/texts')

Page({
  data: {
    t: TEXT,
    words: [],
    currentIndex: 0,
    currentWord: {},
    showMeaning: false,
    progressPercent: 0,
    earnedStrips: 0,
    knowCount: 0,
    isPlaying: false,
    accent: 'us'
  },

  onLoad() {
    const store = getStore()
    const words = getDailyWords(store.settings.dailyWordGoal || 20)
    this.setData({
      words,
      currentWord: words[0],
      progressPercent: getProgressPercent(1, words.length)
    })
    this.enrichCurrentWord()
  },

  onUnload() {
    const { destroyAudio } = require('../../utils/audio')
    destroyAudio()
  },

  enrichCurrentWord() {
    const { currentWord, currentIndex, words } = this.data
    enrichWord(currentWord).then((enriched) => {
      const newWords = [...words]
      newWords[currentIndex] = enriched
      this.setData({
        words: newWords,
        currentWord: enriched
      })
    })
  },

  flipCard() {
    this.setData({ showMeaning: !this.data.showMeaning })
  },

  playWord() {
    const word = this.data.currentWord.word
    if (!word || this.data.isPlaying) return

    this.setData({ isPlaying: true })
    playWord(word, this.data.accent)
      .then(() => {
        this.setData({ isPlaying: false })
      })
      .catch(() => {
        this.setData({ isPlaying: false })
        wx.showToast({ title: TEXT.wordsPlayFail, icon: 'none' })
      })
  },

  toggleAccent() {
    const accent = this.data.accent === 'us' ? 'uk' : 'us'
    this.setData({ accent })
    wx.showToast({
      title: accent === 'us' ? TEXT.wordsSwitchUs : TEXT.wordsSwitchUk,
      icon: 'none'
    })
  },

  markKnow() {
    this.nextWord(true)
  },

  markForget() {
    this.nextWord(false)
  },

  nextWord(isKnown) {
    const { currentIndex, words, knowCount } = this.data
    let newKnowCount = knowCount
    if (isKnown) newKnowCount += 1

    const nextIndex = currentIndex + 1

    if (nextIndex >= words.length) {
      const result = completeLearning('words', newKnowCount)
      this.setData({ earnedStrips: this.data.earnedStrips + result.stripsReward })

      wx.showModal({
        title: TEXT.wordsCompleteTitle,
        content: TEXT.format(TEXT.wordsCompleteContent, {
          count: newKnowCount,
          strips: result.stripsReward
        }),
        confirmText: TEXT.focusConfirmFeed,
        cancelText: TEXT.wordsAgain,
        success: (res) => {
          if (res.confirm) {
            wx.switchTab({ url: '/pages/home/home' })
          } else {
            const newWords = getDailyWords(getStore().settings.dailyWordGoal)
            this.setData({
              words: newWords,
              currentIndex: 0,
              currentWord: newWords[0],
              showMeaning: false,
              knowCount: 0,
              progressPercent: getProgressPercent(1, newWords.length),
              isPlaying: false
            })
            this.enrichCurrentWord()
          }
        }
      })
      return
    }

    this.setData({
      currentIndex: nextIndex,
      currentWord: words[nextIndex],
      showMeaning: false,
      knowCount: newKnowCount,
      progressPercent: getProgressPercent(nextIndex + 1, words.length),
      isPlaying: false
    })
    this.enrichCurrentWord()
  }
})
