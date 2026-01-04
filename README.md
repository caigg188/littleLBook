# <img src="./llb_icon.png" width="32" height="32" alt="小L书"> 小L书 - LinuxDo 小红书风格主题

<p align="center">
  <img src="https://img.shields.io/badge/version-2.6-ff2442?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik0xMiAyQzYuNDggMiAyIDYuNDggMiAxMnM0LjQ4IDEwIDEwIDEwIDEwLTQuNDggMTAtMTBTMTcuNTIgMiAxMiAyem0wIDE4Yy00LjQxIDAtOC0zLjU5LTgtOHMzLjU5LTggOC04IDggMy41OSA4IDgtMy41OSA4LTggOHoiLz48L3N2Zz4=" alt="version">
  <img src="https://img.shields.io/badge/license-MIT-52c41a?style=for-the-badge" alt="license">
  <img src="https://img.shields.io/badge/Tampermonkey-支持-1890ff?style=for-the-badge&logo=tampermonkey" alt="platform">
</p>

<p align="center">
  <b>✨ 将 LinuxDo 论坛变成小红书风格的瀑布流卡片布局 ✨</b>
</p>

<p align="center">
  <a href="https://greasyfork.org/zh-CN/scripts/561129">📦 GreasyFork 安装</a> •
  <a href="https://github.com/caigg188/littleLBook">🐙 GitHub 仓库</a> •
  <a href="https://linux.do/u/jackyliii/summary">👤 作者主页</a>
</p>

---

## 🎯 功能亮点

<table>
<tr>
<td width="50%">

### 🎨 视觉体验
- **瀑布流布局** - 小红书同款卡片瀑布流
- **智能封面** - 自动提取帖子图片，无图显示精美文字卡片
- **10种卡片配色** - 亮色/暗色模式自动适配
- **手绘装饰** - 角标、线条等装饰元素
- **文字特效** - 荧光笔高亮、波浪线、下划线等

</td>
<td width="50%">

### ⚙️ 功能设置
- **6+主题色** - 预设配色 + 自定义颜色
- **布局切换** - 瀑布流 / 等高行模式
- **暗色模式** - 跟随系统 / 手动切换
- **统计信息** - 可选显示回复数、浏览量
- **自动更新** - 支持 Tampermonkey 自动更新

</td>
</tr>
<tr>
<td width="50%">

### ⚡ 性能优化
- **图片懒加载** - 可视区域优先加载
- **智能速率限制** - 防止请求过快被封
- **指数退避** - 失败自动重试策略
- **冷却提示** - 请求受限时友好提醒

</td>
<td width="50%">

### 📱 兼容适配
- **响应式布局** - 4/3/2列自适应
- **深色模式** - 完整的暗色主题支持
- **帖子详情页** - 专属样式优化
- **Dark Reader** - 兼容暗色扩展

</td>
</tr>
</table>

---

## 📦 安装方式

### 前置要求

请先安装用户脚本管理器：

| 扩展 | Chrome | Firefox | Edge | Safari |
|------|--------|---------|------|--------|
| [Tampermonkey](https://www.tampermonkey.net/) ⭐推荐 | ✅ | ✅ | ✅ | ✅ |
| [Violentmonkey](https://violentmonkey.github.io/) | ✅ | ✅ | ✅ | ❌ |

### 一键安装

<p align="center">
  <a href="https://greasyfork.org/zh-CN/scripts/561129">
    <img src="https://img.shields.io/badge/GreasyFork-安装脚本-ff2442?style=for-the-badge&logo=greasyfork&logoColor=white" alt="Install from GreasyFork">
  </a>
</p>

或者从 GitHub 安装：
```
https://raw.githubusercontent.com/caigg188/littleLBook/main/littleLBook.user.js
```

---

## 🎮 使用说明

### 打开设置面板

安装后访问 [linux.do](https://linux.do)，点击页面右上角的 <img src="./llb_icon.png" width="16" height="16"> 按钮：

```
┌─────────────────────────────────┐
│  [图标] 小L书              × │
├─────────────────────────────────┤
│  基础设置                        │
│  ┌─────────────────────────┐   │
│  │ ✨ 启用小L书      [ON]  │   │
│  │ 📐 卡片错落布局   [ON]  │   │
│  │ 📊 显示统计信息   [ON]  │   │
│  │ 🌙 暗色模式   [跟随系统]│   │
│  └─────────────────────────┘   │
│                                 │
│  主题颜色                        │
│  🔴 🔵 🟢 🟣 🟠 🩷 [自定义]    │
└─────────────────────────────────┘
```

### 设置项说明

| 设置 | 说明 |
|------|------|
| ✨ **启用小L书** | 开关瀑布流卡片布局 |
| 📐 **卡片错落布局** | 开启瀑布流效果，关闭则等高行排列 |
| 📊 **显示统计信息** | 卡片底部显示 💬回复数 👁️浏览数 |
| 🌙 **暗色模式** | 跟随系统 / 始终亮色 / 始终暗色 |

### 主题颜色

| 主题 | 色值 | 预览 |
|------|------|------|
| 小红书红 | `#ff2442` | 🔴 经典小红书配色 |
| 天空蓝 | `#1890ff` | 🔵 清爽科技感 |
| 清新绿 | `#52c41a` | 🟢 自然护眼 |
| 神秘紫 | `#722ed1` | 🟣 高贵优雅 |
| 活力橙 | `#fa541c` | 🟠 热情活力 |
| 少女粉 | `#eb2f96` | 🩷 甜美可爱 |

> 💡 还可以使用颜色选择器自定义任意颜色！

---

## 🖼️ 效果展示

### 列表页 - 瀑布流布局

```
┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
│  📷    │ │ ╭────╮ │ │  📷    │ │ ✿────┐ │
│  图片  │ │ │ 💡 │ │ │  图片  │ │ │ ✨ │ │
│  封面  │ │ │文字│ │ │  封面  │ │ │文字│ │
│        │ │ │卡片│ │ │        │ │ │卡片│ │
├────────┤ │ ╰────╯ │ ├────────┤ │ └────┘ │
│ 标题   │ ├────────┤ │ 标题   │ ├────────┤
│ 👤  ❤️ │ │ 标题   │ │ 👤  ❤️ │ │ 标题   │
└────────┘ │ 👤  ❤️ │ └────────┘ │ 👤  ❤️ │
           └────────┘            └────────┘
```

### 卡片特性

- **📷 图片卡片** - 自动提取帖子首图，支持多图计数 `🖼 3`
- **✨ 文字卡片** - 10种柔和配色 + emoji装饰 + 手绘边角
- **📌 置顶标识** - 醒目的置顶徽章
- **🏷️ 分类标签** - 左上角显示帖子分类
- **❤️ 点赞状态** - 实时显示点赞数和状态

---

## 🏗️ 技术架构

```
littleLBook.user.js (v2.6)
│
├── 📦 Config          配置管理
│   ├── 默认配置与主题色
│   ├── GM_setValue/getValue 持久化
│   └── localStorage 缓存优化
│
├── 🛠️ Utils           工具函数
│   ├── 颜色转换 (hex ↔ rgb)
│   ├── 数字格式化 (1.2k, 3.4w)
│   ├── 防抖函数
│   └── 伪随机数生成器
│
├── 🎨 Styles          样式管理
│   ├── 早期样式注入 (防闪烁)
│   ├── 基础样式 (卡片、动画)
│   ├── 主题样式 (颜色变量)
│   └── 深色模式适配
│
├── ⚙️ Panel           设置面板
│   ├── 响应式UI
│   ├── 实时预览
│   └── 配置同步
│
├── 📐 Grid            瀑布流引擎
│   ├── IntersectionObserver 懒加载
│   ├── 智能速率限制
│   ├── 指数退避重试
│   ├── 文字特效处理
│   └── 装饰元素生成
│
└── 🚀 App             应用主控
    ├── 路由监听
    ├── MutationObserver
    └── 生命周期管理
```

### 核心技术

| 技术 | 用途 |
|------|------|
| `IntersectionObserver` | 图片懒加载触发 |
| `MutationObserver` | 监听动态内容加载 |
| `requestIdleCallback` | 空闲时间处理任务 |
| `CSS Variables` | 动态主题切换 |
| `滑动窗口限流` | 请求速率控制 |
| `指数退避` | 失败重试策略 |

---

## 📝 更新日志

### v2.6 (2026-01-03)
- ✨ 添加速率限制和退避策略，防止请求过快
- ✨ 请求冷却时显示友好提示
- 🎨 深色模式全面适配（标题、分类、标签、按钮等）
- 🐛 修复帖子底部按钮颜色问题
- 🐛 修复浅色/深色模式切换时的样式兼容

### v2.5
- ✨ 设置面板标题栏跟随主题色
- ✨ GitHub按钮添加Star提示
- 🎨 "小红书模式"更名为"小L书"

### v2.4
- ✨ 新增卡片错落布局开关
- ✨ 新增暗色模式设置（跟随系统/手动）
- 🎨 优化深色模式卡片配色

<details>
<summary>查看更早版本</summary>

### v2.3
- ✨ 帖子详情页样式优化
- 🐛 修复文字特效显示问题

### v2.2
- ✨ 10种卡片配色方案
- ✨ 文字特效（高亮、波浪线等）
- ✨ 手绘装饰元素

### v2.1
- ✨ 图片懒加载优化
- 🐛 修复移动端布局问题

### v2.0
- 🎉 完全重写，模块化架构
- ✨ 新增设置面板
- ✨ 支持自定义主题色

</details>

---

## 🤝 参与贡献

欢迎提交 Issue 和 Pull Request！

```bash
# 克隆仓库
git clone https://github.com/caigg188/littleLBook.git

# 创建特性分支
git checkout -b feature/your-feature

# 提交更改
git commit -m "feat: add your feature"

# 推送并创建 PR
git push origin feature/your-feature
```

### 反馈渠道

- 🐛 **Bug 反馈**: [GitHub Issues](https://github.com/caigg188/littleLBook/issues)
- 💡 **功能建议**: [GitHub Discussions](https://github.com/caigg188/littleLBook/discussions)
- 💬 **交流讨论**: [LinuxDo 帖子](https://linux.do/t/topic/1399797)

---

## 📄 许可证

本项目采用 [MIT License](LICENSE) 开源许可证。

---

## 👤 作者

<table>
<tr>
<td align="center">
  <a href="https://linux.do/u/jackyliii/summary">
    <b>JackyLiii</b>
  </a>
  <br>
  <a href="https://linux.do/u/jackyliii/summary">LinuxDo</a> •
  <a href="https://github.com/caigg188">GitHub</a>
</td>
</tr>
</table>

---

<p align="center">
  <b>如果觉得好用，请给个 ⭐ Star 支持一下！</b>
</p>

<p align="center">
  Made with ❤️ for LinuxDo Community
</p>
