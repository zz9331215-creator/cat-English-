const DEFAULT_SRC = '/assets/images/kitten-cat.apng'

Component({
  properties: {
    width: {
      type: Number,
      value: 320
    },
    src: {
      type: String,
      value: DEFAULT_SRC
    },
    mode: {
      type: String,
      value: 'aspectFit'
    }
  },

  data: {
    imgStyle: ''
  },

  observers: {
    width() {
      this.syncSize()
    }
  },

  lifetimes: {
    attached() {
      this.syncSize()
    }
  },

  methods: {
    syncSize() {
      const w = Number(this.properties.width) || 320
      this.setData({
        imgStyle: `width:${w}rpx;height:${w}rpx;`
      })
    }
  }
})
