const fs = require('fs')
const path = require('path')

const root = path.join(__dirname, '..')

const files = {
  'app.json': `{
  "pages": [
    "pages/home/home",
    "pages/focus/focus",
    "pages/plan/plan",
    "pages/stats/stats",
    "pages/profile/profile",
    "pages/words/words",
    "pages/speaking/speaking",
    "pages/shop/shop"
  ],
  "window": {
    "navigationBarBackgroundColor": "#FFFFFF",
    "navigationBarTitleText": "\\u55b5\\u55b5\\u5b66\\u82f1\\u8bed",
    "navigationBarTextStyle": "black",
    "backgroundColor": "#F7F7F8",
    "backgroundTextStyle": "dark"
  },
  "tabBar": {
    "custom": true,
    "color": "#B0B0B0",
    "selectedColor": "#1A1A1A",
    "backgroundColor": "#FFFFFF",
    "borderStyle": "white",
    "list": [
      { "pagePath": "pages/focus/focus", "text": "\\u4e13\\u6ce8" },
      { "pagePath": "pages/plan/plan", "text": "\\u8ba1\\u5212" },
      { "pagePath": "pages/home/home", "text": "\\u55b5\\u5c4b" },
      { "pagePath": "pages/stats/stats", "text": "\\u7edf\\u8ba1" },
      { "pagePath": "pages/profile/profile", "text": "\\u6211\\u7684" }
    ]
  },
  "permission": {
    "scope.record": {
      "desc": "\\u7528\\u4e8e\\u53e3\\u8bed\\u7ec3\\u4e60\\u5f55\\u97f3\\u529f\\u80fd"
    }
  },
  "requiredPrivateInfos": [],
  "style": "v2",
  "sitemapLocation": "sitemap.json",
  "lazyCodeLoading": "requiredComponents"
}
`,

  'pages/home/home.json': `{
  "navigationBarTitleText": "\\u55b5\\u5c4b",
  "usingComponents": {
    "kitten-avatar": "/components/kitten-avatar/kitten-avatar"
  }
}
`,

  'pages/focus/focus.json': `{
  "navigationBarTitleText": "\\u4e13\\u6ce8",
  "usingComponents": {
    "kitten-avatar": "/components/kitten-avatar/kitten-avatar"
  }
}
`,

  'pages/plan/plan.json': `{
  "navigationBarTitleText": "\\u5b66\\u4e60\\u8ba1\\u5212"
}
`,

  'pages/stats/stats.json': `{
  "navigationBarTitleText": "\\u7edf\\u8ba1\\u6570\\u636e"
}
`,

  'pages/profile/profile.json': `{
  "navigationBarTitleText": "\\u6211\\u7684"
}
`,

  'pages/words/words.json': `{
  "navigationBarTitleText": "\\u5355\\u8bcd\\u672c"
}
`,

  'pages/speaking/speaking.json': `{
  "navigationBarTitleText": "\\u7ec3\\u53e3\\u8bed",
  "usingComponents": {
    "kitten-avatar": "/components/kitten-avatar/kitten-avatar"
  }
}
`,

  'pages/shop/shop.json': `{
  "navigationBarTitleText": "\\u5546\\u5e97"
}
`,

  'sitemap.json': `{
  "desc": "sitemap",
  "rules": [
    { "action": "allow", "page": "*" }
  ]
}
`,

  'project.config.json': `{
  "description": "english-cat-miniapp",
  "packOptions": { "ignore": [], "include": [] },
  "setting": {
    "bundle": false,
    "userConfirmedBundleSwitch": false,
    "urlCheck": false,
    "scopeDataCheck": false,
    "coverView": true,
    "es6": true,
    "postcss": true,
    "compileHotReLoad": true,
    "lazyloadPlaceholderEnable": false,
    "preloadBackgroundData": false,
    "minified": true,
    "autoAudits": false,
    "newFeature": false,
    "uglifyFileName": false,
    "uploadWithSourceMap": true,
    "useIsolateContext": true,
    "nodeModules": true,
    "enhance": true,
    "useMultiFrameRuntime": true,
    "useApiHook": true,
    "useApiHostProcess": true,
    "showShadowRootInWxmlPanel": true,
    "packNpmManually": false,
    "enableEngineNative": false,
    "packNpmRelationList": [],
    "minifyWXSS": true,
    "showES6CompileOption": false,
    "minifyWXML": true,
    "babelSetting": { "ignore": [], "disablePlugins": [], "outputPath": "" },
    "compileWorklet": false,
    "localPlugins": false,
    "disableUseStrict": false,
    "useCompilerPlugins": false,
    "condition": false,
    "swc": false,
    "disableSWC": true
  },
  "compileType": "miniprogram",
  "libVersion": "3.5.5",
  "appid": "touristappid",
  "projectname": "english-cat-miniapp",
  "condition": {},
  "editorSetting": { "tabIndent": "insertSpaces", "tabSize": 2 },
  "simulatorPluginLibVersion": {}
}
`,

  'project.private.config.json': `{
  "description": "private",
  "projectname": "english-cat-miniapp",
  "setting": {
    "compileHotReLoad": true,
    "urlCheck": false,
    "coverView": true,
    "lazyloadPlaceholderEnable": false,
    "skylineRenderEnable": false,
    "preloadBackgroundData": false,
    "autoAudits": false,
    "useApiHook": true,
    "showShadowRootInWxmlPanel": true,
    "useStaticServer": false,
    "useLanDebug": false,
    "showES6CompileOption": false,
    "checkInvalidKey": true,
    "ignoreDevUnusedFiles": true,
    "bigPackageSizeSupport": false,
    "useIsolateContext": true
  },
  "libVersion": "3.5.5",
  "condition": {}
}
`
}

for (const [rel, content] of Object.entries(files)) {
  const full = path.join(root, rel)
  fs.mkdirSync(path.dirname(full), { recursive: true })
  fs.writeFileSync(full, content, 'ascii')
  const buf = fs.readFileSync(full)
  const bad = [...buf].filter((b) => b > 127)
  JSON.parse(fs.readFileSync(full, 'utf8'))
  console.log(rel, 'ok', 'non-ascii-bytes:', bad.length)
}

console.log('done')
