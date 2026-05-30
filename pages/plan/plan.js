const { getStore } = require('../../utils/store')
const { getWeekDates, getProgressPercent } = require('../../utils/util')
const TEXT = require('../../utils/texts')

Page({
  data: {
    t: TEXT,
    monthText: '',
    weekDays: [
      TEXT.weekSun,
      TEXT.weekMon,
      TEXT.weekTue,
      TEXT.weekWed,
      TEXT.weekThu,
      TEXT.weekFri,
      TEXT.weekSat
    ],
    dates: [],
    tasks: [],
    doneCount: 0,
    dailyPercent: 0,
    progressDesc: ''
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 1 })
    }
    this.loadData()
  },

  loadData() {
    const store = getStore()
    const now = new Date()
    const dates = getWeekDates().map(d => ({
      ...d,
      hasRecord: !!store.stats.dailyRecords[d.key]
    }))
    const tasks = store.tasks.items
    const doneCount = tasks.filter(t => t.done).length

    this.setData({
      monthText: `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}`,
      dates,
      tasks,
      doneCount,
      dailyPercent: getProgressPercent(doneCount, tasks.length),
      progressDesc: TEXT.format(TEXT.planProgressDesc, {
        done: doneCount,
        total: tasks.length
      })
    })
  },

  toggleTask(e) {
    const id = e.currentTarget.dataset.id
    const store = getStore()
    const task = store.tasks.items.find(t => t.id === id)
    if (task) {
      task.done = !task.done
      if (task.done) task.current = task.target
      const { saveStore } = require('../../utils/store')
      saveStore(store)
      this.loadData()
    }
  },

  goPractice(e) {
    const type = e.currentTarget.dataset.type
    if (type === 'words') {
      wx.navigateTo({ url: '/pages/words/words' })
    } else {
      wx.navigateTo({ url: '/pages/speaking/speaking' })
    }
  },

  addTask() {
    wx.showActionSheet({
      itemList: [TEXT.planAddWords, TEXT.planAddSpeaking],
      success: (res) => {
        const type = res.tapIndex === 0 ? 'words' : 'speaking'
        const url = type === 'words' ? '/pages/words/words' : '/pages/speaking/speaking'
        wx.navigateTo({ url })
      }
    })
  }
})
