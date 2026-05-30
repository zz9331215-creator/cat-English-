const TEXT = require('../../utils/texts')

const ACTION_FROM_MOOD = {
  eating: 'eating',
  hungry: 'hungry',
  happy: 'full',
  normal: 'idle'
}

const STAGE_SCALE = {
  baby: 0.55,
  kitten: 0.72,
  teen: 0.88,
  adult: 1,
  chubby: 1.28
}

Component({
  properties: {
    size: {
      type: Number,
      value: 1
    },
    stage: {
      type: String,
      value: 'baby'
    },
    mood: {
      type: String,
      value: 'happy'
    },
    action: {
      type: String,
      value: 'idle'
    }
  },

  data: {
    t: TEXT,
    displayAction: 'idle',
    displaySize: 1
  },

  observers: {
    'mood, action, size, stage'() {
      this.syncView()
    }
  },

  lifetimes: {
    attached() {
      this.syncView()
    }
  },

  methods: {
    syncView() {
      const { mood, action, size, stage } = this.properties
      let displayAction = action || 'idle'

      if (displayAction === 'idle' || displayAction === 'normal') {
        displayAction = ACTION_FROM_MOOD[mood] || 'idle'
      }
      if (displayAction === 'happy') displayAction = 'full'
      if (displayAction === 'lying' || displayAction === 'lie') displayAction = 'lying'

      const stageScale = STAGE_SCALE[stage] || STAGE_SCALE.baby
      const propSize = Number(size)
      const displaySize = (propSize > 0 ? propSize : stageScale) || 1

      this.setData({ displayAction, displaySize })
    }
  }
})
