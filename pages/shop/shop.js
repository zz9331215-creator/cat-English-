const { getStore, saveStore } = require('../../utils/store')
const TEXT = require('../../utils/texts')

Page({
  data: {
    t: TEXT,
    catStrips: 0,
    items: [
      { id: 1, emoji: TEXT.iconFish, name: TEXT.shopItem1Name, desc: TEXT.shopItem1Desc, price: 1 },
      { id: 2, emoji: TEXT.iconSushi, name: TEXT.shopItem2Name, desc: TEXT.shopItem2Desc, price: 3 },
      { id: 3, emoji: TEXT.iconToy, name: TEXT.shopItem3Name, desc: TEXT.shopItem3Desc, price: 5 },
      { id: 4, emoji: TEXT.iconRibbon, name: TEXT.shopItem4Name, desc: TEXT.shopItem4Desc, price: 10 }
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
      wx.showToast({ title: TEXT.stripsNotEnough, icon: 'none' })
      return
    }

    store.currency.catStrips -= item.price
    if (item.id === 2) {
      store.pet.exp += 20
    }
    saveStore(store)
    this.setData({ catStrips: store.currency.catStrips })
    wx.showToast({
      title: TEXT.format(TEXT.shopRedeemToast, { name: item.name }),
      icon: 'success'
    })
  }
})
