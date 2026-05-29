Component({
  data: {
    selected: 0,
    list: [
      { pagePath: '/pages/focus/focus', text: '专注', icon: '🍅' },
      { pagePath: '/pages/plan/plan', text: '计划', icon: '📅' },
      { pagePath: '/pages/home/home', text: '喵屋', icon: '🐱' },
      { pagePath: '/pages/stats/stats', text: '统计', icon: '📊' },
      { pagePath: '/pages/profile/profile', text: '我的', icon: '😺' }
    ]
  },

  methods: {
    switchTab(e) {
      const { path, index } = e.currentTarget.dataset
      wx.switchTab({ url: path })
      this.setData({ selected: index })
    }
  }
})
