# 喵学英语 - 微信小程序

融合英语口语、单词背诵与猫咪养成的微信小程序。

## 新增能力（v1.1）

- **Lottie 动画小猫** - 眨眼、摇摆、进食等流畅矢量动画
- **真实单词发音** - 有道词典 TTS + Free Dictionary API 双备份
- **小程序图标** - `assets/icons/app-icon-1024.png` 可直接上传微信公众平台
- **CLI 一键启动** - 支持微信开发者工具命令行操控

## 快速运行

### 方式一：微信开发者工具（推荐）

1. 打开 **微信开发者工具**
2. 导入项目：`C:\Users\zheng\english-cat-miniapp`
3. 菜单 **工具 → 构建 npm**（若 Lottie 报错）
4. 点击 **编译** 预览

### 方式二：命令行 CLI

> 首次需在开发者工具中开启：**设置 → 安全设置 → 服务端口：开启**

```bat
:: 打开项目
D:\Tencent\微信web开发者工具\cli.bat open --project C:\Users\zheng\english-cat-miniapp

:: 构建 npm
D:\Tencent\微信web开发者工具\cli.bat build-npm --project C:\Users\zheng\english-cat-miniapp

:: 或运行项目脚本
scripts\dev-open.bat
```

### 本地构建 npm（无需 IDE）

```bash
npm install
npm run build:npm
```

## 发音 API 说明

| 来源 | 用途 | 域名 |
|------|------|------|
| 有道词典 | 主发音（美音/英音） | `dict.youdao.com` |
| Free Dictionary | 备用发音 + 音标补全 | `api.dictionaryapi.dev` |

**正式上线前** 需在 [微信公众平台](https://mp.weixin.qq.com/) → 开发管理 → 开发设置 → 服务器域名 中添加：

- request 合法域名：`https://api.dictionaryapi.dev`
- downloadFile 合法域名：`https://dict.youdao.com`、`https://api.dictionaryapi.dev`

开发阶段已在 `project.config.json` 中关闭 `urlCheck` 便于调试。

## 图标使用

| 文件 | 用途 |
|------|------|
| `assets/icons/app-icon-1024.png` | 小程序主图标（上传公众平台） |
| `assets/icons/tab-home.png` | Tab 图标参考 |

## Lottie 动画资源

| 文件 | 场景 |
|------|------|
| `assets/lottie/cat-idle.json` | 喵屋待机 |
| `assets/lottie/cat-eating.json` | 喂食动画 |
| `assets/lottie/cat-typing.json` | 专注/口语学习 |

组件路径：`components/lottie-cat`（Lottie 失败时自动降级为 CSS 小猫）

## 项目结构

```
english-cat-miniapp/
├── components/lottie-cat/     # Lottie 小猫组件
├── miniprogram_npm/           # 构建后的 npm 包
├── assets/icons/              # 小程序图标
├── assets/lottie/             # Lottie 动画 JSON
├── utils/audio.js             # 发音 API
└── scripts/dev-open.bat       # CLI 启动脚本
```
