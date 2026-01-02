# 📕 LinuxDo 小红书风格

<p align="center">
  <img src="https://img.shields.io/badge/version-2.1-ff2442?style=flat-square" alt="version">
  <img src="https://img.shields.io/badge/license-MIT-green?style=flat-square" alt="license">
  <img src="https://img.shields.io/badge/platform-Tampermonkey-blue?style=flat-square" alt="platform">
  <img src="https://img.shields.io/badge/site-linux.do-orange?style=flat-square" alt="site">
</p>

<p align="center">
  <b>🎨 将 LinuxDo 论坛改造成小红书风格瀑布流布局</b>
</p>

<p align="center">
  <img src="https://linux.do/images/default-favicon.ico" width="80" alt="LinuxDo">
  <span style="font-size: 40px; margin: 0 20px;">➡️</span>
  <span style="font-size: 60px;">📕</span>
</p>

---

## ✨ 功能特性

### 🎯 核心功能
- **瀑布流布局** - 仿小红书的卡片式瀑布流展示
- **智能封面** - 自动提取帖子图片作为封面，无图则显示精美文字卡片
- **主题定制** - 6 种预设主题色 + 自定义颜色选择器
- **统计信息** - 可选显示回复数、浏览数、点赞数

### 🎨 视觉效果
- 10 种精心设计的卡片配色方案
- 手绘装饰元素（角标、线条）
- 文字特效（高亮、下划线、加粗、圆点）
- 平滑的悬停动画效果
- 帖子详情页专属样式优化

### ⚡ 性能优化
- 图片懒加载 + 智能队列
- DOM 变化监听，自动加载新帖
- `requestIdleCallback` 处理非关键任务
- 防抖函数避免频繁渲染

### 📱 响应式设计
- 自适应 4/3/2 列布局
- 移动端优化样式
- 触屏友好的交互体验

---

## 📦 安装

### 前置要求
请先安装以下浏览器扩展之一：
- [Tampermonkey](https://www.tampermonkey.net/) (推荐)
- [Violentmonkey](https://violentmonkey.github.io/)
- [Greasemonkey](https://www.greasespot.net/) (仅 Firefox)

### 安装脚本

#### 方式一：GreasyFork（推荐）
> 🔗 [点击从 GreasyFork 安装](https://greasyfork.org/scripts/your-script-id)

#### 方式二：手动安装
1. 点击浏览器扩展图标 → 创建新脚本
2. 复制 `littleLBook.user.js` 的全部内容
3. 粘贴到编辑器中并保存

---

## 🎮 使用指南

### 开启/关闭
安装后访问 [linux.do](https://linux.do)，在页面右上角会出现一个设置按钮：

- 🟢 **绿色圆点** - 小红书模式已启用
- ⚪ **灰色按钮** - 小红书模式已关闭

### 设置面板
点击设置按钮打开配置面板：

| 设置项 | 说明 |
|--------|------|
| ✨ 启用小红书模式 | 开启/关闭瀑布流卡片布局 |
| 📊 显示统计信息 | 是否在卡片底部显示回复数和浏览数 |
| 🎨 主题颜色 | 选择预设主题或自定义颜色 |

### 预设主题
| 主题 | 颜色 | 色值 |
|------|------|------|
| 小红书红 | 🔴 | `#ff2442` |
| 天空蓝 | 🔵 | `#1890ff` |
| 清新绿 | 🟢 | `#52c41a` |
| 神秘紫 | 🟣 | `#722ed1` |
| 活力橙 | 🟠 | `#fa541c` |
| 少女粉 | 🩷 | `#eb2f96` |

---

## 🖼️ 效果预览

### 列表页瀑布流
```
┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐
│ 📷   │ │ 💡   │ │ 📷   │ │ ✨   │
│ 图片 │ │ 文字 │ │ 图片 │ │ 文字 │
│ 卡片 │ │ 卡片 │ │ 卡片 │ │ 卡片 │
├──────┤ └──────┘ ├──────┤ └──────┘
│ 标题 │          │ 标题 │
│ 👤❤️ │          │ 👤❤️ │
└──────┘          └──────┘
```

### 卡片样式特点
- **图片卡片**：自动提取帖子首图，支持多图计数显示
- **文字卡片**：10 种柔和配色，带 emoji 装饰和手绘元素
- **置顶标识**：📌 醒目的置顶徽章
- **分类标签**：左上角显示帖子分类

---

## ⚙️ 技术架构

```
littleLBook.user.js
├── Config     # 配置管理模块（GM_setValue/GM_getValue）
├── Utils      # 工具函数（颜色转换、数字格式化、防抖等）
├── Styles     # 样式注入模块（基础样式 + 主题样式）
├── Panel      # 设置面板模块（UI 交互）
├── Grid       # 瀑布流模块（卡片渲染、图片懒加载）
└── App        # 应用主模块（初始化、路由监听）
```

### 使用的 API
- `GM_addStyle` - 注入 CSS 样式
- `GM_setValue` / `GM_getValue` - 持久化用户配置
- `IntersectionObserver` - 图片懒加载
- `MutationObserver` - 监听 DOM 变化
- `requestIdleCallback` - 空闲时执行任务

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

### 开发指南
1. Fork 本仓库
2. 创建特性分支：`git checkout -b feature/AmazingFeature`
3. 提交更改：`git commit -m 'Add some AmazingFeature'`
4. 推送分支：`git push origin feature/AmazingFeature`
5. 提交 Pull Request

### 问题反馈
- 🐛 [提交 Bug](../../issues/new?template=bug_report.md)
- 💡 [功能建议](../../issues/new?template=feature_request.md)

---

## 📄 许可证

本项目采用 [MIT License](LICENSE) 开源许可证。

---

## 👤 作者

**JackyLiii**

- LinuxDo: [@jackyliii](https://linux.do/u/jackyliii/summary)
- GitHub: [@JackyLiii](https://github.com/JackyLiii)

---

## 🌟 Star History

如果这个项目对你有帮助，请给个 ⭐ Star 支持一下！

---

<p align="center">
  Made with ❤️ for LinuxDo Community
</p>
