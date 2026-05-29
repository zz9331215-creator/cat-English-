const lottie = require('lottie-miniprogram')
const idleData = require('../../assets/lottie/cat-idle.json')
const eatingData = require('../../assets/lottie/cat-eating.json')
const typingData = require('../../assets/lottie/cat-typing.json')

const ANIMATION_MAP = {
  idle: idleData,
  eating: eatingData,
  happy: idleData,
  normal: idleData,
  hungry: idleData,
  studying: typingData
}

Component({
  properties: {
    width: { type: Number, value: 280 },
    height: { type: Number, value: 280 },
    size: { type: Number, value: 1 },
    mood: { type: String, value: 'happy' },
    action: { type: String, value: 'idle' }
  },

  data: {
    useFallback: false
  },

  observers: {
    action(action) {
      if (this._ready) this.loadAnimation(action)
    }
  },

  lifetimes: {
    ready() {
      this.initLottie()
    },
    detached() {
      this.destroyLottie()
    }
  },

  methods: {
    initLottie() {
      const query = this.createSelectorQuery().in(this)
      query
        .select('#lottie-canvas')
        .fields({ node: true, size: true })
        .exec((res) => {
          if (!res || !res[0] || !res[0].node) {
            this.setData({ useFallback: true })
            return
          }

          try {
            const canvas = res[0].node
            const ctx = canvas.getContext('2d')
            const dpr = wx.getSystemInfoSync().pixelRatio || 2
            const width = res[0].width
            const height = res[0].height

            canvas.width = width * dpr
            canvas.height = height * dpr
            ctx.scale(dpr, dpr)

            lottie.setup(canvas)
            this._canvas = canvas
            this._ctx = ctx
            this._ready = true
            this.loadAnimation(this.properties.action)
          } catch (e) {
            console.error('Lottie init failed:', e)
            this.setData({ useFallback: true })
          }
        })
    },

    loadAnimation(action) {
      if (!this._ctx) return

      const animationData = ANIMATION_MAP[action] || idleData
      if (this._ani) {
        this._ani.destroy()
        this._ani = null
      }

      this._ani = lottie.loadAnimation({
        loop: true,
        autoplay: true,
        animationData,
        rendererSettings: {
          context: this._ctx,
          clearCanvas: true
        }
      })
    },

    destroyLottie() {
      if (this._ani) {
        this._ani.destroy()
        this._ani = null
      }
      this._ready = false
    }
  }
})
