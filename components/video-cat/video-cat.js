const WEBP_SRC = '/assets/video/cat-idle.webp'
const GIF_SRC = '/assets/video/cat-idle.gif'
const MP4_SRC = '/assets/video/cat-idle.mp4'

Component({
  properties: {
    width: { type: Number, value: 280 },
    height: { type: Number, value: 280 },
    size: { type: Number, value: 1 },
    mood: { type: String, value: 'happy' },
    action: { type: String, value: 'idle' },
    src: { type: String, value: '' }
  },

  data: {
    useFallback: false,
    mediaMode: 'gif',
    mediaSrc: GIF_SRC,
    videoReady: false,
    videoId: ''
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

  pageLifetimes: {
    show() {
      if (this.data.mediaMode === 'video') this.playVideo()
    }
  },

  methods: {
    initMedia() {
      const customSrc = this.properties.src
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
        this.setData({ mediaMode: 'webp', mediaSrc: WEBP_SRC })
      } else {
        this.setData({ mediaMode: 'gif', mediaSrc: GIF_SRC })
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
        this.setData({ mediaMode: 'gif', mediaSrc: GIF_SRC })
        return
      }

      if (mode === 'gif') {
        this.setData({
          mediaMode: 'video',
          mediaSrc: MP4_SRC,
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
