const DEFAULT_WEBP = '/assets/video/cat-idle.webp'
const DEFAULT_GIF = '/assets/video/cat-idle.gif'
const DEFAULT_MP4 = '/assets/video/cat-idle.mp4'

Component({
  properties: {
    width: { type: Number, value: 280 },
    height: { type: Number, value: 280 },
    size: { type: Number, value: 1 },
    mood: { type: String, value: 'happy' },
    action: { type: String, value: 'idle' },
    src: { type: String, value: '' },
    webpSrc: { type: String, value: '' },
    gifSrc: { type: String, value: '' },
    mp4Src: { type: String, value: '' }
  },

  data: {
    useFallback: false,
    mediaMode: 'gif',
    mediaSrc: DEFAULT_GIF,
    videoReady: false,
    videoId: '',
    resolvedWebp: DEFAULT_WEBP,
    resolvedGif: DEFAULT_GIF,
    resolvedMp4: DEFAULT_MP4
  },

  lifetimes: {
    attached() {
      this.setData({
        videoId: `cat-${Date.now()}-${Math.floor(Math.random() * 10000)}`
      })
    },
    ready() {
      this.initMedia()
    }
  },

  observers: {
    'webpSrc, gifSrc, mp4Src, src'() {
      if (this._ready) this.initMedia()
    }
  },

  pageLifetimes: {
    show() {
      if (this.data.mediaMode === 'video') this.playVideo()
    }
  },

  methods: {
    resolveSources() {
      const { src, webpSrc, gifSrc, mp4Src } = this.properties
      if (src) {
        return { webp: webpSrc || src, gif: gifSrc || src, mp4: mp4Src || src, single: src }
      }
      return {
        webp: webpSrc || DEFAULT_WEBP,
        gif: gifSrc || DEFAULT_GIF,
        mp4: mp4Src || DEFAULT_MP4,
        single: ''
      }
    },

    initMedia() {
      this._ready = true
      const sources = this.resolveSources()
      this.setData({
        resolvedWebp: sources.webp,
        resolvedGif: sources.gif,
        resolvedMp4: sources.mp4,
        useFallback: false
      })

      const customSrc = sources.single
      if (customSrc) {
        if (/\.gif$/i.test(customSrc)) {
          this.setData({ mediaMode: 'gif', mediaSrc: customSrc })
        } else if (/\.webp$/i.test(customSrc)) {
          this.setData({ mediaMode: 'webp', mediaSrc: customSrc })
        } else {
          this.setData({ mediaMode: 'video', mediaSrc: customSrc, videoReady: true }, () => this.playVideo())
        }
        return
      }

      const { platform } = wx.getSystemInfoSync()
      if (platform === 'devtools') {
        this.setData({ mediaMode: 'webp', mediaSrc: sources.webp })
      } else {
        this.setData({ mediaMode: 'gif', mediaSrc: sources.gif })
      }
    },

    playVideo() {
      if (this.data.mediaMode !== 'video' || !this.data.videoReady || !this.data.videoId) return
      wx.createVideoContext(this.data.videoId, this).play()
    },

    onImageError(e) {
      const mode = this.data.mediaMode
      console.warn(`Cat ${mode} failed:`, e.detail)

      if (mode === 'webp') {
        this.setData({ mediaMode: 'gif', mediaSrc: this.data.resolvedGif })
        return
      }

      if (mode === 'gif') {
        this.setData({
          mediaMode: 'video',
          mediaSrc: this.data.resolvedMp4,
          videoReady: true
        }, () => this.playVideo())
      }
    },

    onVideoReady() {
      this.playVideo()
    },

    onVideoError(e) {
      console.warn('Video cat failed, using fallback:', e.detail)
      this.setData({ useFallback: true })
    }
  }
})
