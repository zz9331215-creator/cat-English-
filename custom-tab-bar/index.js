const TEXT = require('../utils/texts')

Component({
  data: {
    selected: 0,
    list: [
      { pagePath: '/pages/focus/focus', text: TEXT.tabFocus, icon: TEXT.iconTomato },
      { pagePath: '/pages/plan/plan', text: TEXT.tabPlan, icon: TEXT.iconBook },
      { pagePath: '/pages/home/home', text: TEXT.tabHome, icon: TEXT.iconCat },
      { pagePath: '/pages/stats/stats', text: TEXT.tabStats, icon: TEXT.iconBook },
      { pagePath: '/pages/profile/profile', text: TEXT.tabMine, icon: TEXT.iconCat }
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
