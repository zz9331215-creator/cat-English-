const { getStore, STAGES, getStageByExp } = require('../../utils/store')

Page({
  data: {
    tabs: ['日', '周', '月', '总'],
    activeTab: '总',
    stats: {},
    catStrips: 0,
    totalMinutes: 0,
    heatmap: [],
    stages: []
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 3 })
    }
    this.loadStats()
  },

  switchTab(e) {
    this.setData({ activeTab: e.currentTarget.dataset.tab })
  },

  loadStats() {
    const store = getStore()
    const currentStage = getStageByExp(store.pet.exp)

    const stages = STAGES.map(s => ({
      ...s,
      reached: store.pet.exp >= s.minExp,
      current: s.key === currentStage.key
    }))

    const heatmap = this.generateHeatmap(store.stats.dailyRecords)

    this.setData({
      stats: store.stats,
      catStrips: store.currency.catStrips,
      totalMinutes: store.user.totalStudyMinutes,
      heatmap,
      stages
    })
  },

  generateHeatmap(records) {
    const cells = []
    const today = new Date()
    for (let i = 27; i >= 0; i--) {
      const d = new Date(today)
      d.setDate(today.getDate() - i)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
      const record = records[key]
      let level = 0
      if (record) {
        const total = (record.minutes || 0) + (record.words || 0)
        if (total > 60) level = 3
        else if (total > 30) level = 2
        else if (total > 0) level = 1
      }
      cells.push({ date: key, level })
    }
    return cells
  }
})
