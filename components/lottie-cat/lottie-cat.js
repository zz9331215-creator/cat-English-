Component({
  properties: {
    width: { type: Number, value: 280 },
    height: { type: Number, value: 280 },
    size: { type: Number, value: 1 },
    mood: { type: String, value: 'happy' },
    action: { type: String, value: 'idle' },
    stage: { type: String, value: 'baby' }
  },

  data: {},

  lifetimes: {
    ready() {},
    detached() {}
  }
})
