const fs = require('fs')
const path = require('path')
const root = path.join(__dirname, '..')

function u(s) {
  return s.replace(/\\u\{([0-9A-Fa-f]+)\}/g, (_, hex) =>
    String.fromCodePoint(parseInt(hex, 16))
  )
}

const homeWxml = u(String.raw`<view class="container home-page">
  <view class="status-bar">
    <view class="status-item growth">
      <view class="status-icon">\u{1F497}</view>
      <view class="status-info">
        <text class="status-value">{{pet.exp}}/{{pet.maxExp}}</text>
        <text class="status-label">{{stageName}}</text>
      </view>
      <view class="status-progress">
        <view class="status-progress-fill" style="width: {{growthPercent}}%"></view>
      </view>
    </view>
    <view class="status-item satiety">
      <view class="status-icon">\u{1F41F}</view>
      <view class="status-info">
        <text class="status-value">{{pet.satiety}}%</text>
        <text class="status-label">\u{9971}\u{80f6}\u{5ea6}</text>
      </view>
    </view>
    <view class="status-item currency">
      <view class="status-icon">\u{1F41F}</view>
      <view class="status-info">
        <text class="status-value">{{catStrips}}</text>
        <text class="status-label">\u{732b}\u{6761}</text>
      </view>
    </view>
  </view>
  <view class="room-scene">
    <view class="room-wall"></view>
    <view class="room-floor"></view>
    <view class="deco window">
      <view class="curtain curtain-left"></view>
      <view class="curtain curtain-right"></view>
    </view>
    <view class="deco photo photo-1">
      <image class="photo-img" src="/assets/images/black-kitten-peek.png" mode="aspectFill" />
    </view>
    <view class="deco photo photo-2">\u{1F63A}</view>
    <view class="deco board">
      <text class="board-text">\u{6bcf}\u{65e5}\u{5b66}\u{82f1}\u{8bed}\u{6253}\u{5361}\u{8fdb}\u{884c}\u{4e2d}</text>
    </view>
    <view class="deco cat-tree">\u{1F333}</view>
    <view class="deco rug"></view>
    <view class="speech-bubble" wx:if="{{showSpeech}}">
      <text class="speech-text">{{speechText}}</text>
      <view class="speech-btn" wx:if="{{pet.mood === 'hungry'}}" bindtap="onHungryAction">{{catStrips > 0 ? '\u{53bb}\u{5582}\u{98df}' : '\u{53bb}\u{5b66}\u{4e60}'}}</view>
    </view>
    <view class="kitten-area" bindtap="onKittenTap">
      <kitten-avatar size="{{petDisplaySize}}" stage="{{pet.stage}}" mood="{{pet.mood}}" action="{{kittenAction}}" />
    </view>
  </view>
  <view class="side-menu">
    <view class="menu-item" bindtap="goWords">
      <view class="menu-icon">\u{1F4D6}</view>
      <text class="menu-label">\u{80cc}\u{5355}\u{8bcd}</text>
    </view>
    <view class="menu-item" bindtap="goSpeaking">
      <view class="menu-icon">\u{1F3A4}</view>
      <text class="menu-label">\u{7ec3}\u{53e3}\u{8bed}</text>
    </view>
    <view class="menu-item" bindtap="goShop">
      <view class="menu-icon">\u{1F3E0}</view>
      <text class="menu-label">\u{5546}\u{5e97}</text>
    </view>
  </view>
  <view class="bottom-actions">
    <view class="feed-btn {{catStrips > 0 ? '' : 'disabled'}}" bindtap="feedKitten">
      <text class="feed-icon">\u{1F41F}</text>
      <text class="feed-text">\u{5582}\u{732b}\u{6761}</text>
      <text class="feed-cost">-1</text>
    </view>
    <view class="learn-btn" bindtap="goLearn">
      <text>\u{5f00}\u{59cb}\u{5b66}\u{4e60}</text>
    </view>
  </view>
  <view class="reward-modal" wx:if="{{showReward}}" bindtap="closeReward">
    <view class="reward-content" catchtap="">
      <text class="reward-emoji">\u{1F389}</text>
      <text class="reward-title">\u{5582}\u{98df}\u{6210}\u{529f}\u{ff01}</text>
      <text class="reward-desc">\u{55b5}\u{55b5}\u{83b7}\u{5f97}\u{4e86} {{rewardExp}} \u{7ecf}\u{9a8c}\u{503c}</text>
      <text class="reward-stage" wx:if="{{stageUp}}">\u{606d}\u{559c}\u{5347}\u{7ea7}\u{5230} {{stageName}}\u{ff01}</text>
    </view>
  </view>
</view>
`)

fs.writeFileSync(path.join(root, 'pages/home/home.wxml'), homeWxml, 'utf8')
console.log('fixed pages/home/home.wxml')
