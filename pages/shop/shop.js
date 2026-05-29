const { getStore, saveStore } = require('../../utils/store')

Page({
  data: {
    catStrips: 0,
    items: [
      { id: 1, emoji: '🐟', name: '普通猫条', desc: '咪咪的最爱', price: 1 },
      { id: 2, emoji: '🍣', name: '三文鱼条', desc: '额外 +20 经验', price: 3 },
      { id: 3, emoji: '🧸', name: '逗猫棒', desc: '提升心情', price: 5 },
      { id: 4, emoji: '🎀', name: '蝴蝶结', desc: '装扮咪咪', price: 10 }
    ]
  },

  onShow() {
    const store = getStore()
    this.setData({ catStrips: store.currency.catStrips })
  },

  buyItem(e) {
    const id = e.currentTarget.dataset.id
    const item = this.data.items.find(i => i.id === id)
    const store = getStore()

    if (store.currency.catStrips < item.price) {
      wx.showToast({ title: '猫条不够，快去学习吧！', icon: 'none' })
      return
    }

    store.currency.catStrips -= item.price
    if (item.id === 2) {
      store.pet.exp += 20
    }
    saveStore(store)
    this.setData({ catStrips: store.currency.catStrips })
    wx.showToast({ title: `兑换了${item.name}`, icon: 'success' })
  }
})
