// ==UserScript==
// @name         小L书——LinuxDo仿小红书主题
// @namespace    http://tampermonkey.net/
// @version      2.6
// @license      MIT
// @description  将LinuxDo改造成小红书风格瀑布流布局，支持自定义主题色
// @author       JackyLiii
// @match        https://linux.do/*
// @icon         https://linux.do/uploads/default/optimized/3X/9/d/9dd49731091ce8656e94433a26a3ef36062b3994_2_32x32.png
// @updateURL    https://raw.githubusercontent.com/caigg188/littleLBook/main/littleLBook.user.js
// @downloadURL  https://raw.githubusercontent.com/caigg188/littleLBook/main/littleLBook.user.js
// @supportURL   https://github.com/caigg188/littleLBook/issues
// @homepageURL  https://github.com/caigg188/littleLBook
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// ==/UserScript==

(function () {
    'use strict';

    /* ============================================
     * 早期样式注入（防止闪烁）
     * ============================================ */
    const EarlyStyles = {
        injected: false,
        styleId: 'xhs-early-styles',

        // 早期检测暗色模式
        _detectDarkEarly() {
            // 读取缓存的用户设置
            let darkMode = 'auto';
            try {
                const saved = localStorage.getItem('xhs_darkmode_cache');
                if (saved) darkMode = saved;
            } catch { }

            if (darkMode === 'dark') return true;
            if (darkMode === 'light') return false;

            // auto 模式：检测系统/扩展
            if (document.documentElement.hasAttribute('data-darkreader-scheme')) {
                return document.documentElement.getAttribute('data-darkreader-scheme') === 'dark';
            }
            if (document.documentElement.classList.contains('dark') ||
                document.documentElement.getAttribute('data-theme') === 'dark') {
                return true;
            }
            return window.matchMedia?.('(prefers-color-scheme: dark)').matches || false;
        },

        inject() {
            if (this.injected) return;
            this.injected = true;

            // 尝试从存储读取配置判断是否启用
            let enabled = true;
            try {
                const saved = localStorage.getItem('xhs_enabled_cache');
                if (saved !== null) enabled = saved === 'true';
            } catch { }

            if (!enabled) return;

            const isDark = this._detectDarkEarly();

            // 立即注入关键样式，隐藏原始列表 + 预加载卡片样式
            const css = `
                /* 早期隐藏原始列表，防止闪烁 */
                body.xhs-early .topic-list,
                body.xhs-early .topic-list-header {
                    opacity: 0 !important;
                    pointer-events: none !important;
                    position: absolute !important;
                    visibility: hidden !important;
                }
                /* 预设背景色 */
                body.xhs-early {
                    background: ${isDark ? '#1a1a1a' : '#f5f5f7'} !important;
                }

                /* ===== 预加载卡片核心样式，避免闪烁 ===== */
                /* 文字特效 - 必须早期加载 */
                .xhs-hl {
                    display: inline;
                    padding: 2px 4px;
                    margin: 0 1px;
                    font-weight: 600;
                    background: linear-gradient(to top, var(--hl-color, rgba(255,200,0,0.5)) 0%, var(--hl-color, rgba(255,200,0,0.5)) 70%, transparent 70%, transparent 100%);
                }
                .xhs-ul {
                    text-decoration: underline;
                    text-decoration-thickness: 2px;
                    text-underline-offset: 3px;
                    font-weight: 600;
                }
                .xhs-wave {
                    text-decoration: underline wavy;
                    text-decoration-thickness: 1.5px;
                    text-underline-offset: 3px;
                    font-weight: 600;
                }
                .xhs-dot {
                    position: relative;
                }
                .xhs-dot::after {
                    content: '•';
                    position: absolute;
                    bottom: -8px;
                    left: 50%;
                    transform: translateX(-50%);
                    font-size: 8px;
                }
                .xhs-bd {
                    font-weight: 700;
                }

                /* 卡片配色 - 必须早期加载 */
                ${isDark ? `
                /* 暗色模式卡片配色 */
                .xhs-card-bg.s1 { background: #3D2222; color: #F5C6C6; }
                .xhs-card-bg.s1 .xhs-hl { --hl-color: rgba(252,129,129,0.5); }
                .xhs-card-bg.s1 .xhs-ul, .xhs-card-bg.s1 .xhs-wave { text-decoration-color: #FC8181; }
                .xhs-card-bg.s1 .xhs-deco { color: #7C3030; }

                .xhs-card-bg.s2 { background: #1E3A5F; color: #BEE3F8; }
                .xhs-card-bg.s2 .xhs-hl { --hl-color: rgba(99,179,237,0.5); }
                .xhs-card-bg.s2 .xhs-ul, .xhs-card-bg.s2 .xhs-wave { text-decoration-color: #63B3ED; }
                .xhs-card-bg.s2 .xhs-deco { color: #4A79A8; }

                .xhs-card-bg.s3 { background: #1C3D2D; color: #C6F6D5; }
                .xhs-card-bg.s3 .xhs-hl { --hl-color: rgba(104,211,145,0.5); }
                .xhs-card-bg.s3 .xhs-ul, .xhs-card-bg.s3 .xhs-wave { text-decoration-color: #68D391; }
                .xhs-card-bg.s3 .xhs-deco { color: #48BB78; }

                .xhs-card-bg.s4 { background: #2D2248; color: #E9D8FD; }
                .xhs-card-bg.s4 .xhs-hl { --hl-color: rgba(183,148,244,0.5); }
                .xhs-card-bg.s4 .xhs-ul, .xhs-card-bg.s4 .xhs-wave { text-decoration-color: #B794F4; }
                .xhs-card-bg.s4 .xhs-deco { color: #9F7AEA; }

                .xhs-card-bg.s5 { background: #3D3020; color: #FEEBC8; }
                .xhs-card-bg.s5 .xhs-hl { --hl-color: rgba(246,173,85,0.5); }
                .xhs-card-bg.s5 .xhs-ul, .xhs-card-bg.s5 .xhs-wave { text-decoration-color: #F6AD55; }
                .xhs-card-bg.s5 .xhs-deco { color: #ED8936; }

                .xhs-card-bg.s6 { background: #1A3D3D; color: #B2F5EA; }
                .xhs-card-bg.s6 .xhs-hl { --hl-color: rgba(79,209,197,0.5); }
                .xhs-card-bg.s6 .xhs-ul, .xhs-card-bg.s6 .xhs-wave { text-decoration-color: #4FD1C5; }
                .xhs-card-bg.s6 .xhs-deco { color: #38B2AC; }

                .xhs-card-bg.s7 { background: #3D3D1A; color: #FAF089; }
                .xhs-card-bg.s7 .xhs-hl { --hl-color: rgba(236,201,75,0.5); }
                .xhs-card-bg.s7 .xhs-ul, .xhs-card-bg.s7 .xhs-wave { text-decoration-color: #ECC94B; }
                .xhs-card-bg.s7 .xhs-deco { color: #D69E2E; }

                .xhs-card-bg.s8 { background: #3D1A2D; color: #FED7E2; }
                .xhs-card-bg.s8 .xhs-hl { --hl-color: rgba(246,135,179,0.5); }
                .xhs-card-bg.s8 .xhs-ul, .xhs-card-bg.s8 .xhs-wave { text-decoration-color: #F687B3; }
                .xhs-card-bg.s8 .xhs-deco { color: #ED64A6; }

                .xhs-card-bg.s9 { background: #1A3A3D; color: #C4F1F9; }
                .xhs-card-bg.s9 .xhs-hl { --hl-color: rgba(118,228,247,0.5); }
                .xhs-card-bg.s9 .xhs-ul, .xhs-card-bg.s9 .xhs-wave { text-decoration-color: #76E4F7; }
                .xhs-card-bg.s9 .xhs-deco { color: #0BC5EA; }

                .xhs-card-bg.s10 { background: #3D2A1A; color: #FFE4CA; }
                .xhs-card-bg.s10 .xhs-hl { --hl-color: rgba(255,159,90,0.5); }
                .xhs-card-bg.s10 .xhs-ul, .xhs-card-bg.s10 .xhs-wave { text-decoration-color: #FF9F5A; }
                .xhs-card-bg.s10 .xhs-deco { color: #ED8936; }
                ` : `
                /* 亮色模式卡片配色 */
                .xhs-card-bg.s1 { background: #FFF5F5; color: #4A2C2C; }
                .xhs-card-bg.s1 .xhs-hl { --hl-color: rgba(254,178,178,0.6); }
                .xhs-card-bg.s1 .xhs-ul, .xhs-card-bg.s1 .xhs-wave { text-decoration-color: #FC8181; }
                .xhs-card-bg.s1 .xhs-deco { color: #FEB2B2; }

                .xhs-card-bg.s2 { background: #EBF8FF; color: #2A4365; }
                .xhs-card-bg.s2 .xhs-hl { --hl-color: rgba(144,205,244,0.6); }
                .xhs-card-bg.s2 .xhs-ul, .xhs-card-bg.s2 .xhs-wave { text-decoration-color: #63B3ED; }
                .xhs-card-bg.s2 .xhs-deco { color: #90CDF4; }

                .xhs-card-bg.s3 { background: #F0FFF4; color: #22543D; }
                .xhs-card-bg.s3 .xhs-hl { --hl-color: rgba(154,230,180,0.6); }
                .xhs-card-bg.s3 .xhs-ul, .xhs-card-bg.s3 .xhs-wave { text-decoration-color: #68D391; }
                .xhs-card-bg.s3 .xhs-deco { color: #9AE6B4; }

                .xhs-card-bg.s4 { background: #FAF5FF; color: #44337A; }
                .xhs-card-bg.s4 .xhs-hl { --hl-color: rgba(214,188,250,0.6); }
                .xhs-card-bg.s4 .xhs-ul, .xhs-card-bg.s4 .xhs-wave { text-decoration-color: #B794F4; }
                .xhs-card-bg.s4 .xhs-deco { color: #D6BCFA; }

                .xhs-card-bg.s5 { background: #FFFAF0; color: #744210; }
                .xhs-card-bg.s5 .xhs-hl { --hl-color: rgba(251,211,141,0.6); }
                .xhs-card-bg.s5 .xhs-ul, .xhs-card-bg.s5 .xhs-wave { text-decoration-color: #F6AD55; }
                .xhs-card-bg.s5 .xhs-deco { color: #FBD38D; }

                .xhs-card-bg.s6 { background: #E6FFFA; color: #234E52; }
                .xhs-card-bg.s6 .xhs-hl { --hl-color: rgba(129,230,217,0.6); }
                .xhs-card-bg.s6 .xhs-ul, .xhs-card-bg.s6 .xhs-wave { text-decoration-color: #4FD1C5; }
                .xhs-card-bg.s6 .xhs-deco { color: #81E6D9; }

                .xhs-card-bg.s7 { background: #FFFFF0; color: #5F370E; }
                .xhs-card-bg.s7 .xhs-hl { --hl-color: rgba(246,224,94,0.6); }
                .xhs-card-bg.s7 .xhs-ul, .xhs-card-bg.s7 .xhs-wave { text-decoration-color: #ECC94B; }
                .xhs-card-bg.s7 .xhs-deco { color: #F6E05E; }

                .xhs-card-bg.s8 { background: #FFF5F7; color: #521B41; }
                .xhs-card-bg.s8 .xhs-hl { --hl-color: rgba(251,182,206,0.6); }
                .xhs-card-bg.s8 .xhs-ul, .xhs-card-bg.s8 .xhs-wave { text-decoration-color: #F687B3; }
                .xhs-card-bg.s8 .xhs-deco { color: #FBB6CE; }

                .xhs-card-bg.s9 { background: #EDFDFD; color: #1D4044; }
                .xhs-card-bg.s9 .xhs-hl { --hl-color: rgba(157,236,249,0.6); }
                .xhs-card-bg.s9 .xhs-ul, .xhs-card-bg.s9 .xhs-wave { text-decoration-color: #76E4F7; }
                .xhs-card-bg.s9 .xhs-deco { color: #9DECF9; }

                .xhs-card-bg.s10 { background: #FFF8F1; color: #63351D; }
                .xhs-card-bg.s10 .xhs-hl { --hl-color: rgba(255,189,138,0.6); }
                .xhs-card-bg.s10 .xhs-ul, .xhs-card-bg.s10 .xhs-wave { text-decoration-color: #FF9F5A; }
                .xhs-card-bg.s10 .xhs-deco { color: #FFBD8A; }
                `}

                /* 装饰元素 */
                .xhs-deco {
                    position: absolute;
                    pointer-events: none;
                    line-height: 1;
                }
                .xhs-deco.corner { font-size: 16px; opacity: 0.5; }
                .xhs-deco.tl { top: 12px; left: 12px; }
                .xhs-deco.tr { top: 12px; right: 12px; }
                .xhs-deco.bl { bottom: 12px; left: 12px; }
                .xhs-deco.br { bottom: 12px; right: 12px; }
                .xhs-deco.line { font-size: 8px; letter-spacing: 4px; opacity: 0.25; }
                .xhs-deco.line-t { top: 6px; left: 50%; transform: translateX(-50%); }
                .xhs-deco.line-b { bottom: 6px; left: 50%; transform: translateX(-50%); }

                /* 卡片基础样式 */
                .xhs-card {
                    break-inside: avoid;
                    background: ${isDark ? '#2d2d2d' : '#fff'};
                    border-radius: 14px;
                    overflow: hidden;
                    box-shadow: 0 2px 8px ${isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.04)'};
                    margin-bottom: 16px;
                    contain: layout style paint;
                }
                .xhs-card-bg {
                    position: relative;
                    padding: 24px 18px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: flex-start;
                    text-align: left;
                    overflow: hidden;
                }
                .xhs-card-bg.size-normal { min-height: 180px; }
                .xhs-card-bg.size-tall { min-height: 240px; }
                .xhs-card-emoji { font-size: 32px; margin-bottom: 12px; position: relative; z-index: 1; }
                .xhs-card-excerpt {
                    font-size: 14px;
                    line-height: 2;
                    font-weight: 500;
                    word-break: break-word;
                    position: relative;
                    z-index: 1;
                    max-width: 100%;
                    display: -webkit-box;
                    -webkit-line-clamp: 4;
                    -webkit-box-orient: vertical;
                }
            `;

            const style = document.createElement('style');
            style.id = this.styleId;
            style.textContent = css;

            // 尽早插入
            if (document.head) {
                document.head.appendChild(style);
            } else if (document.documentElement) {
                document.documentElement.appendChild(style);
            }

            // 立即添加 body class（如果 body 存在）
            if (document.body) {
                document.body.classList.add('xhs-early');
            } else {
                // 监听 body 创建
                const observer = new MutationObserver(() => {
                    if (document.body) {
                        document.body.classList.add('xhs-early');
                        observer.disconnect();
                    }
                });
                observer.observe(document.documentElement, { childList: true });
            }
        },

        remove() {
            document.getElementById(this.styleId)?.remove();
            document.body?.classList.remove('xhs-early');
        },

        // 缓存启用状态到 localStorage 供下次早期读取
        cacheEnabled(enabled) {
            try {
                localStorage.setItem('xhs_enabled_cache', String(enabled));
            } catch { }
        },

        // 缓存暗色模式设置供下次早期读取
        cacheDarkMode(mode) {
            try {
                localStorage.setItem('xhs_darkmode_cache', mode);
            } catch { }
        }
    };

    // 立即执行早期样式注入
    EarlyStyles.inject();

    /* ============================================
     * 配置模块
     * ============================================ */
    const Config = {
        KEY: 'xhs_style_config_v2',

        defaults: {
            enabled: true,
            themeColor: '#ff2442',
            showStats: true,
            darkMode: 'auto', // 'auto' | 'light' | 'dark'
            cardStagger: true // 卡片错落布局
        },

        themes: {
            '小红书红': '#ff2442',
            '天空蓝': '#1890ff',
            '清新绿': '#52c41a',
            '神秘紫': '#722ed1',
            '活力橙': '#fa541c',
            '少女粉': '#eb2f96'
        },

        _cache: null,

        get() {
            if (this._cache) return this._cache;
            try {
                const saved = GM_getValue(this.KEY);
                this._cache = saved ? { ...this.defaults, ...JSON.parse(saved) } : { ...this.defaults };
            } catch {
                this._cache = { ...this.defaults };
            }
            return this._cache;
        },

        set(key, value) {
            this._cache[key] = value;
            GM_setValue(this.KEY, JSON.stringify(this._cache));
        },

        reset() {
            this._cache = { ...this.defaults };
            GM_setValue(this.KEY, JSON.stringify(this._cache));
        }
    };

    /* ============================================
     * 工具模块
     * ============================================ */
    const Utils = {
        hexToRgb(hex) {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result
                ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
                : '255, 36, 66';
        },

        adjustColor(hex, amount) {
            const num = parseInt(hex.slice(1), 16);
            const r = Math.min(255, Math.max(0, (num >> 16) + amount));
            const g = Math.min(255, Math.max(0, ((num >> 8) & 0xFF) + amount));
            const b = Math.min(255, Math.max(0, (num & 0xFF) + amount));
            return `#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)}`;
        },

        formatNumber(n) {
            n = parseInt(n) || 0;
            if (n >= 10000) return (n / 10000).toFixed(1) + 'w';
            if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
            return String(n);
        },

        debounce(fn, delay) {
            let timer = null;
            return function (...args) {
                clearTimeout(timer);
                timer = setTimeout(() => fn.apply(this, args), delay);
            };
        },

        isTopicPage: () => /\/t\/[^/]+\/\d+/.test(location.pathname),
        isListPage: () => !!document.querySelector('tbody.topic-list-body'),

        // 检测系统是否为暗色模式
        detectSystemDark() {
            // 1. 检测 Dark Reader 扩展
            if (document.documentElement.hasAttribute('data-darkreader-scheme')) {
                return document.documentElement.getAttribute('data-darkreader-scheme') === 'dark';
            }
            // 2. 检测常见的暗色模式 class/属性
            if (document.documentElement.classList.contains('dark') ||
                document.body?.classList.contains('dark') ||
                document.documentElement.getAttribute('data-theme') === 'dark' ||
                document.body?.getAttribute('data-theme') === 'dark') {
                return true;
            }
            // 3. 检测系统偏好
            return window.matchMedia?.('(prefers-color-scheme: dark)').matches || false;
        },

        // 根据配置判断是否应该使用暗色模式
        isDarkMode() {
            const config = Config.get();
            if (config.darkMode === 'dark') return true;
            if (config.darkMode === 'light') return false;
            // auto 模式：跟随系统
            return this.detectSystemDark();
        },

        escapeHtml(str) {
            const div = document.createElement('div');
            div.textContent = str;
            return div.innerHTML;
        },

        seededRandom(seed) {
            let h = 0;
            for (let i = 0; i < seed.length; i++) {
                h = Math.imul(31, h) + seed.charCodeAt(i) | 0;
            }
            return () => {
                h = Math.imul(h ^ h >>> 15, h | 1);
                h ^= h + Math.imul(h ^ h >>> 7, h | 61);
                return ((h ^ h >>> 14) >>> 0) / 4294967296;
            };
        },

        // 使用 requestIdleCallback 处理非关键任务
        scheduleIdle(fn) {
            if ('requestIdleCallback' in window) {
                requestIdleCallback(fn, { timeout: 2000 });
            } else {
                setTimeout(fn, 50);
            }
        }
    };

    /* ============================================
     * 样式模块
     * ============================================ */
    const Styles = {
        baseStyleId: 'xhs-base-styles',
        themeStyleId: 'xhs-theme-styles',

        injectBase() {
            if (document.getElementById(this.baseStyleId)) return;

            GM_addStyle(`
                /* ===== 设置按钮 ===== */
                .xhs-btn {
                    display: flex !important;
                    align-items: center;
                    justify-content: center;
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    cursor: pointer;
                    transition: background 0.2s;
                    position: relative;
                }
                .xhs-btn:hover { background: var(--xhs-light, rgba(255, 36, 66, 0.1)); }
                .xhs-btn svg { width: 20px; height: 20px; transition: fill 0.2s; }
                .xhs-btn.on svg { fill: var(--xhs-c, #ff2442); }
                .xhs-btn.off svg { fill: #999; }
                .xhs-btn.on::after {
                    content: '';
                    position: absolute;
                    bottom: 4px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 5px;
                    height: 5px;
                    background: var(--xhs-c, #ff2442);
                    border-radius: 50%;
                }

                /* ===== 设置面板 ===== */
                .xhs-overlay {
                    display: none;
                    position: fixed;
                    inset: 0;
                    z-index: 99998;
                    background: rgba(0,0,0,0.3);
                    opacity: 0;
                    transition: opacity 0.2s;
                }
                .xhs-overlay.show { display: block; opacity: 1; }

                .xhs-panel {
                    position: fixed;
                    top: 60px;
                    right: 16px;
                    width: 320px;
                    background: #fff;
                    border-radius: 16px;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
                    z-index: 99999;
                    opacity: 0;
                    visibility: hidden;
                    transform: translateY(-10px) scale(0.98);
                    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
                    overflow: hidden;
                    max-height: calc(100vh - 80px);
                    overflow-y: auto;
                }
                .xhs-panel.show {
                    opacity: 1;
                    visibility: visible;
                    transform: translateY(0) scale(1);
                }

                .xhs-panel-header {
                    padding: 16px 20px;
                    background: linear-gradient(135deg, var(--xhs-c, #ff2442), var(--xhs-lighter, #ff6b81));
                    color: #fff;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    position: sticky;
                    top: 0;
                    z-index: 1;
                }
                .xhs-panel-title {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 15px;
                    font-weight: 600;
                }
                .xhs-panel-ver {
                    font-size: 10px;
                    background: rgba(255,255,255,0.25);
                    padding: 2px 8px;
                    border-radius: 8px;
                }
                .xhs-panel-close {
                    width: 28px;
                    height: 28px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    background: rgba(255,255,255,0.2);
                    font-size: 18px;
                    transition: all 0.2s;
                }
                .xhs-panel-close:hover {
                    background: rgba(255,255,255,0.35);
                    transform: rotate(90deg);
                }

                .xhs-panel-body { padding: 16px 20px; }

                .xhs-section { margin-bottom: 18px; }
                .xhs-section:last-child { margin-bottom: 0; }
                .xhs-section-title {
                    font-size: 11px;
                    font-weight: 600;
                    color: #999;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    margin-bottom: 10px;
                }

                .xhs-row {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 12px 14px;
                    background: #f8f8f8;
                    border-radius: 12px;
                    margin-bottom: 8px;
                }
                .xhs-row:last-child { margin-bottom: 0; }
                .xhs-row-info { display: flex; align-items: center; gap: 10px; }
                .xhs-row-icon { font-size: 16px; }
                .xhs-row-label { font-size: 13px; color: #333; font-weight: 500; }
                .xhs-row-desc { font-size: 10px; color: #999; margin-top: 2px; }

                .xhs-switch {
                    width: 44px;
                    height: 24px;
                    background: #ddd;
                    border-radius: 12px;
                    cursor: pointer;
                    position: relative;
                    transition: background 0.2s;
                    flex-shrink: 0;
                }
                .xhs-switch.on { background: linear-gradient(135deg, var(--xhs-c, #ff2442), var(--xhs-lighter, #ff6b81)); }
                .xhs-switch::after {
                    content: '';
                    position: absolute;
                    top: 2px;
                    left: 2px;
                    width: 20px;
                    height: 20px;
                    background: #fff;
                    border-radius: 50%;
                    transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                    box-shadow: 0 2px 4px rgba(0,0,0,0.15);
                }
                .xhs-switch.on::after { transform: translateX(20px); }

                .xhs-colors {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 8px;
                }
                .xhs-color {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 6px;
                    padding: 10px 6px;
                    border-radius: 10px;
                    cursor: pointer;
                    border: 2px solid transparent;
                    background: #f8f8f8;
                    transition: all 0.15s;
                }
                .xhs-color:hover { background: #f0f0f0; }
                .xhs-color.on { border-color: currentColor; background: #fff; }
                .xhs-color-dot {
                    width: 26px;
                    height: 26px;
                    border-radius: 50%;
                    box-shadow: 0 2px 6px rgba(0,0,0,0.15);
                }
                .xhs-color-name { font-size: 10px; color: #666; }

                .xhs-custom {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 10px 14px;
                    background: #f8f8f8;
                    border-radius: 12px;
                    margin-top: 8px;
                }
                .xhs-picker {
                    width: 36px;
                    height: 36px;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    padding: 0;
                }
                .xhs-picker::-webkit-color-swatch-wrapper { padding: 0; }
                .xhs-picker::-webkit-color-swatch { border: none; border-radius: 6px; }
                .xhs-custom-label { font-size: 12px; color: #666; }

                .xhs-panel-footer {
                    padding: 12px 20px;
                    background: #fafafa;
                    border-top: 1px solid #eee;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    position: sticky;
                    bottom: 0;
                }
                .xhs-footer-links {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                .xhs-footer-author { font-size: 11px; color: #999; }
                .xhs-footer-author a { color: var(--xhs-c, #ff2442); text-decoration: none; }
                .xhs-footer-author a:hover { text-decoration: underline; }
                .xhs-github-link {
                    display: inline-flex;
                    align-items: center;
                    gap: 4px;
                    font-size: 11px;
                    color: #fff;
                    text-decoration: none;
                    padding: 5px 10px;
                    border-radius: 8px;
                    background: linear-gradient(135deg, #24292e, #40464d);
                    transition: all 0.2s;
                    font-weight: 500;
                }
                .xhs-github-link:hover {
                    background: linear-gradient(135deg, #40464d, #24292e);
                    transform: translateY(-1px);
                    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
                }
                .xhs-github-link .star-icon {
                    color: #f1c40f;
                    font-size: 12px;
                }
                .xhs-reset { font-size: 11px; color: var(--xhs-c, #ff2442); cursor: pointer; padding: 4px 8px; border-radius: 6px; transition: background 0.15s; }
                .xhs-reset:hover { background: var(--xhs-light, rgba(255,36,66,0.1)); }

                .xhs-select {
                    padding: 6px 12px;
                    border-radius: 8px;
                    border: 1px solid #ddd;
                    background: #fff;
                    font-size: 12px;
                    color: #333;
                    cursor: pointer;
                    outline: none;
                    transition: border-color 0.2s;
                }
                .xhs-select:hover { border-color: var(--xhs-c, #ff2442); }
                .xhs-select:focus { border-color: var(--xhs-c, #ff2442); box-shadow: 0 0 0 2px var(--xhs-light, rgba(255,36,66,0.1)); }
                
                /* 冷却提示动画 */
                @keyframes xhs-notice-in {
                    from { opacity: 0; transform: translateX(-50%) translateY(20px); }
                    to { opacity: 1; transform: translateX(-50%) translateY(0); }
                }
                @keyframes xhs-notice-out {
                    from { opacity: 1; transform: translateX(-50%) translateY(0); }
                    to { opacity: 0; transform: translateX(-50%) translateY(20px); }
                }
            `);
        },

        injectTheme() {
            this.removeTheme();

            const config = Config.get();
            if (!config.enabled) return;

            const c = config.themeColor;
            const rgb = Utils.hexToRgb(c);
            const lighter = Utils.adjustColor(c, 15);
            const isDark = Utils.isDarkMode();

            // 添加/移除 dark class 以便其他样式识别
            document.body.classList.toggle('xhs-dark', isDark);

            const css = `
                :root {
                    --xhs-c: ${c};
                    --xhs-rgb: ${rgb};
                    --xhs-light: rgba(${rgb}, ${isDark ? '0.15' : '0.1'});
                    --xhs-lighter: ${lighter};
                    --xhs-bg: ${isDark ? '#1a1a1a' : '#f5f5f7'};
                    --xhs-card-bg: ${isDark ? '#2d2d2d' : '#fff'};
                    --xhs-text: ${isDark ? '#e0e0e0' : '#222'};
                    --xhs-text-secondary: ${isDark ? '#aaa' : '#666'};
                    --xhs-text-muted: ${isDark ? '#888' : '#999'};
                    --xhs-border: ${isDark ? '#404040' : '#f0f0f0'};
                    --xhs-shadow: ${isDark ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.04)'};
                    --xhs-shadow-hover: ${isDark ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.08)'};
                }

                body.xhs-on { background: var(--xhs-bg) !important; }

                body.xhs-on .d-header {
                    background: ${isDark ? '#1e1e1e' : '#fff'} !important;
                    box-shadow: 0 1px 0 var(--xhs-c), 0 2px 12px var(--xhs-shadow) !important;
                    border: none !important;
                }

                body.xhs-on .d-header-icons .btn:hover,
                body.xhs-on .d-header-icons .icon:hover {
                    background: var(--xhs-light) !important;
                }

                body.xhs-on .alert.alert-info.clickable {
                    position: fixed !important;
                    top: 12px !important;
                    left: 50% !important;
                    transform: translateX(-50%) !important;
                    z-index: 9998 !important;
                    width: auto !important;
                    max-width: 90vw !important;
                    display: inline-flex !important;
                    align-items: center !important;
                    gap: 6px !important;
                    padding: 10px 20px !important;
                    margin: 0 !important;
                    background: linear-gradient(135deg, var(--xhs-c), var(--xhs-lighter)) !important;
                    color: #fff !important;
                    border: none !important;
                    border-radius: 22px !important;
                    font-size: 13px !important;
                    font-weight: 500 !important;
                    white-space: nowrap !important;
                    box-shadow: 0 4px 20px rgba(var(--xhs-rgb), 0.35) !important;
                    cursor: pointer !important;
                }
                body.xhs-on .alert.alert-info.clickable::before { content: '🔥' !important; }
                body.xhs-on .alert.alert-info.clickable span { color: #fff !important; }

                body.xhs-on .d-icon-circle { color: var(--xhs-c) !important; fill: var(--xhs-c) !important; }
                body.xhs-on .badge-notification.new-topic,
                body.xhs-on .badge-notification.unread-posts { background: var(--xhs-c) !important; }

                body.xhs-on .sidebar-wrapper { background: ${isDark ? '#252525' : '#fff'} !important; }

                body.xhs-on .sidebar-section-link {
                    border-radius: 10px !important;
                    margin: 2px 6px !important;
                }
                body.xhs-on .sidebar-section-link:hover,
                body.xhs-on .sidebar-section-link.active {
                    background: var(--xhs-light) !important;
                    color: var(--xhs-c) !important;
                }

                body.xhs-on .btn-primary {
                    background: linear-gradient(135deg, var(--xhs-c), var(--xhs-lighter)) !important;
                    border: none !important;
                    border-radius: 18px !important;
                    box-shadow: 0 2px 8px rgba(var(--xhs-rgb), 0.25) !important;
                }
                body.xhs-on .btn-primary:hover {
                    box-shadow: 0 4px 16px rgba(var(--xhs-rgb), 0.35) !important;
                    transform: translateY(-1px) !important;
                }

                /* ===== 导航栏主题色 ===== */
                body.xhs-on .navigation-container,
                body.xhs-on section.navigation-container {
                    background: ${isDark ? '#252525' : '#fff'} !important;
                    border-radius: 12px !important;
                    padding: 12px 16px !important;
                    margin-bottom: 16px !important;
                    margin-left: 0 !important;
                    margin-right: 0 !important;
                    width: 100% !important;
                    max-width: 100% !important;
                    box-sizing: border-box !important;
                    box-shadow: 0 2px 8px var(--xhs-shadow) !important;
                }

                /* 类别/标签下拉 */
                body.xhs-on .category-breadcrumb .select-kit-header,
                body.xhs-on .category-breadcrumb details summary,
                body.xhs-on .tag-drop .select-kit-header,
                body.xhs-on .tag-drop details summary {
                    border-radius: 8px !important;
                    border: 1px solid var(--xhs-border) !important;
                    background: ${isDark ? '#333' : '#f8f8f8'} !important;
                }
                body.xhs-on .category-breadcrumb .select-kit-header:hover,
                body.xhs-on .category-breadcrumb details summary:hover,
                body.xhs-on .tag-drop .select-kit-header:hover,
                body.xhs-on .tag-drop details summary:hover {
                    border-color: var(--xhs-c) !important;
                    background: var(--xhs-light) !important;
                }

                /* 覆盖 Discourse 导航下划线变量 */
                body.xhs-on {
                    --d-nav-underline-height: 0 !important;
                    --d-nav-border-color--active: transparent !important;
                }
                
                /* 导航标签 - 加强选择器 */
                body.xhs-on ul.nav.nav-pills li a,
                body.xhs-on ul#navigation-bar.nav-pills li a,
                body.xhs-on .nav-pills > li > a {
                    border-radius: 16px !important;
                    padding: 6px 14px !important;
                    margin: 0 2px !important;
                    color: var(--xhs-text-secondary) !important;
                    background: transparent !important;
                    border: none !important;
                    border-bottom: none !important;
                    text-decoration: none !important;
                    box-shadow: none !important;
                    outline: none !important;
                    transition: all 0.2s ease !important;
                    position: relative !important;
                }
                /* 移除伪元素下划线 */
                body.xhs-on ul.nav.nav-pills li a::before,
                body.xhs-on ul.nav.nav-pills li a::after,
                body.xhs-on ul#navigation-bar.nav-pills li a::before,
                body.xhs-on ul#navigation-bar.nav-pills li a::after,
                body.xhs-on .nav-pills > li > a::before,
                body.xhs-on .nav-pills > li > a::after {
                    display: none !important;
                    content: none !important;
                    border: none !important;
                    background: none !important;
                    height: 0 !important;
                    width: 0 !important;
                }
                body.xhs-on ul.nav.nav-pills li a:hover,
                body.xhs-on ul#navigation-bar.nav-pills li a:hover,
                body.xhs-on .nav-pills > li > a:hover {
                    background: var(--xhs-light) !important;
                    color: var(--xhs-c) !important;
                    border: none !important;
                    border-bottom: none !important;
                    text-decoration: none !important;
                }
                body.xhs-on ul.nav.nav-pills li.active a,
                body.xhs-on ul#navigation-bar.nav-pills li.active a,
                body.xhs-on ul.nav.nav-pills li a.active,
                body.xhs-on ul#navigation-bar.nav-pills li a.active,
                body.xhs-on .nav-pills > li.active > a,
                body.xhs-on .nav-pills > li > a.active,
                body.xhs-on .nav-pills > li > a[aria-current="page"] {
                    background: linear-gradient(135deg, var(--xhs-c), var(--xhs-lighter)) !important;
                    color: #fff !important;
                    font-weight: 600 !important;
                    border: none !important;
                    border-bottom: none !important;
                    text-decoration: none !important;
                    box-shadow: 0 2px 8px rgba(var(--xhs-rgb), 0.3) !important;
                }
                /* 移除激活状态的伪元素 */
                body.xhs-on ul.nav.nav-pills li.active a::before,
                body.xhs-on ul.nav.nav-pills li.active a::after,
                body.xhs-on ul.nav.nav-pills li a.active::before,
                body.xhs-on ul.nav.nav-pills li a.active::after,
                body.xhs-on .nav-pills > li.active > a::before,
                body.xhs-on .nav-pills > li.active > a::after,
                body.xhs-on .nav-pills > li > a.active::before,
                body.xhs-on .nav-pills > li > a.active::after,
                body.xhs-on .nav-pills > li > a[aria-current="page"]::before,
                body.xhs-on .nav-pills > li > a[aria-current="page"]::after {
                    display: none !important;
                    content: none !important;
                    border: none !important;
                    background: none !important;
                    height: 0 !important;
                    width: 0 !important;
                    opacity: 0 !important;
                    visibility: hidden !important;
                }
                
                /* 强制移除 li 元素上的可能下划线 */
                body.xhs-on ul.nav.nav-pills li,
                body.xhs-on ul.nav.nav-pills li.active,
                body.xhs-on ul#navigation-bar.nav-pills li,
                body.xhs-on ul#navigation-bar.nav-pills li.active {
                    border: none !important;
                    border-bottom: none !important;
                    background: transparent !important;
                }
                body.xhs-on ul.nav.nav-pills li::before,
                body.xhs-on ul.nav.nav-pills li::after,
                body.xhs-on ul.nav.nav-pills li.active::before,
                body.xhs-on ul.nav.nav-pills li.active::after,
                body.xhs-on ul#navigation-bar.nav-pills li::before,
                body.xhs-on ul#navigation-bar.nav-pills li::after {
                    display: none !important;
                    content: none !important;
                    border: none !important;
                    background: none !important;
                    height: 0 !important;
                    width: 0 !important;
                }

                /* 新建话题按钮 */
                body.xhs-on #create-topic,
                body.xhs-on button#create-topic,
                body.xhs-on .navigation-controls #create-topic {
                    background: linear-gradient(135deg, var(--xhs-c), var(--xhs-lighter)) !important;
                    color: #fff !important;
                    border: none !important;
                    border-radius: 18px !important;
                    padding: 8px 16px !important;
                    font-weight: 600 !important;
                    box-shadow: 0 2px 8px rgba(var(--xhs-rgb), 0.25) !important;
                    transition: all 0.2s ease !important;
                }
                body.xhs-on #create-topic:hover,
                body.xhs-on button#create-topic:hover {
                    box-shadow: 0 4px 16px rgba(var(--xhs-rgb), 0.35) !important;
                    transform: translateY(-1px) !important;
                }
                body.xhs-on #create-topic .d-icon,
                body.xhs-on #create-topic svg,
                body.xhs-on button#create-topic .d-icon,
                body.xhs-on button#create-topic svg {
                    color: #fff !important;
                    fill: #fff !important;
                }
                body.xhs-on #create-topic .d-button-label {
                    color: #fff !important;
                }

                /* 草稿菜单按钮 */
                body.xhs-on .topic-drafts-menu-trigger,
                body.xhs-on button.topic-drafts-menu-trigger {
                    border-radius: 8px !important;
                    border: 1px solid var(--xhs-border) !important;
                    background: ${isDark ? '#333' : '#f8f8f8'} !important;
                }
                body.xhs-on .topic-drafts-menu-trigger:hover,
                body.xhs-on button.topic-drafts-menu-trigger:hover {
                    border-color: var(--xhs-c) !important;
                    background: var(--xhs-light) !important;
                }

                body.xhs-on .topic-list,
                body.xhs-on .topic-list-header { display: none !important; }

                /* ===== 瀑布流布局（错落模式） ===== */
                .xhs-grid {
                    column-count: 4;
                    column-gap: 16px;
                    padding: 16px 0;
                }
                @media (max-width: 1400px) { .xhs-grid { column-count: 4; } }
                @media (max-width: 1200px) { .xhs-grid { column-count: 3; } }
                @media (max-width: 900px) { .xhs-grid { column-count: 2; column-gap: 12px; } }
                @media (max-width: 520px) { .xhs-grid { column-count: 2; column-gap: 10px; } }

                /* ===== 行布局（等高模式） ===== */
                .xhs-grid.grid-mode {
                    column-count: unset;
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 16px;
                }
                @media (max-width: 1200px) { .xhs-grid.grid-mode { grid-template-columns: repeat(3, 1fr); } }
                @media (max-width: 900px) { .xhs-grid.grid-mode { grid-template-columns: repeat(2, 1fr); gap: 12px; } }
                @media (max-width: 520px) { .xhs-grid.grid-mode { grid-template-columns: repeat(2, 1fr); gap: 10px; } }
                .xhs-grid.grid-mode .xhs-card { margin-bottom: 0; }

                /* ===== 卡片 ===== */
                .xhs-card {
                    break-inside: avoid;
                    background: var(--xhs-card-bg);
                    border-radius: 14px;
                    overflow: hidden;
                    box-shadow: 0 2px 8px var(--xhs-shadow);
                    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s;
                    margin-bottom: 16px;
                    will-change: transform;
                    contain: layout style paint;
                }
                @media (max-width: 900px) { .xhs-card { margin-bottom: 12px; border-radius: 12px; } }
                @media (max-width: 520px) { .xhs-card { margin-bottom: 10px; border-radius: 10px; } }

                .xhs-card:hover {
                    transform: translateY(-6px);
                    box-shadow: 0 12px 32px ${isDark ? 'rgba(var(--xhs-rgb), 0.25)' : 'rgba(var(--xhs-rgb), 0.12)'};
                }

                .xhs-card-cover {
                    display: block;
                    position: relative;
                    overflow: hidden;
                    text-decoration: none;
                }

                /* ===== 文字封面 ===== */
                .xhs-card-bg {
                    position: relative;
                    padding: 24px 18px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: flex-start;
                    text-align: left;
                    overflow: hidden;
                    box-sizing: border-box;
                }
                @media (max-width: 520px) { .xhs-card-bg { padding: 18px 14px; } }

                .xhs-card-bg.size-normal { min-height: 180px; }
                .xhs-card-bg.size-tall { min-height: 240px; }
                @media (max-width: 520px) {
                    .xhs-card-bg.size-normal { min-height: 150px; }
                    .xhs-card-bg.size-tall { min-height: 200px; }
                }

                /* 手绘装饰 */
                .xhs-deco {
                    position: absolute;
                    pointer-events: none;
                    line-height: 1;
                    transition: opacity 0.3s, transform 0.3s;
                }

                .xhs-deco.corner {
                    font-size: 16px;
                    opacity: 0.5;
                }
                @media (max-width: 520px) { .xhs-deco.corner { font-size: 14px; } }
                .xhs-deco.tl { top: 12px; left: 12px; }
                .xhs-deco.tr { top: 12px; right: 12px; }
                .xhs-deco.bl { bottom: 12px; left: 12px; }
                .xhs-deco.br { bottom: 12px; right: 12px; }

                .xhs-deco.line {
                    font-size: 8px;
                    letter-spacing: 4px;
                    opacity: 0.25;
                }
                .xhs-deco.line-t { top: 6px; left: 50%; transform: translateX(-50%); }
                .xhs-deco.line-b { bottom: 6px; left: 50%; transform: translateX(-50%); }

                .xhs-card:hover .xhs-deco.corner { opacity: 0.7; transform: scale(1.1); }

                .xhs-card-emoji {
                    font-size: 32px;
                    margin-bottom: 12px;
                    position: relative;
                    z-index: 1;
                    transition: transform 0.3s;
                }
                @media (max-width: 520px) { .xhs-card-emoji { font-size: 28px; margin-bottom: 10px; } }
                .xhs-card:hover .xhs-card-emoji { transform: scale(1.15) rotate(-8deg); }

                .xhs-card-excerpt {
                    font-size: 14px;
                    line-height: 2;
                    font-weight: 500;
                    word-break: break-word;
                    position: relative;
                    z-index: 1;
                    max-width: 100%;
                    display: -webkit-box;
                    -webkit-line-clamp: 4;
                    -webkit-box-orient: vertical;
                }
                @media (max-width: 520px) { .xhs-card-excerpt { font-size: 12px; line-height: 1.9; -webkit-line-clamp: 3; } }

                /* 文字效果 */
                .xhs-hl {
                    display: inline;
                    padding: 2px 6px;
                    margin: 0 1px;
                    border-radius: 4px;
                    font-weight: 700;
                    background: linear-gradient(to top, var(--hl-color, rgba(255,200,0,0.5)) 0%, var(--hl-color, rgba(255,200,0,0.5)) 70%, transparent 70%, transparent 100%);
                }
                .xhs-ul {
                    text-decoration: underline;
                    text-decoration-thickness: 2px;
                    text-underline-offset: 3px;
                    font-weight: 600;
                }
                .xhs-wave {
                    text-decoration: underline wavy;
                    text-decoration-thickness: 1.5px;
                    text-underline-offset: 3px;
                    font-weight: 600;
                }
                .xhs-dot {
                    position: relative;
                }
                .xhs-dot::after {
                    content: '•';
                    position: absolute;
                    bottom: -8px;
                    left: 50%;
                    transform: translateX(-50%);
                    font-size: 8px;
                }
                .xhs-bd {
                    font-weight: 700;
                }

                /* ===== 卡片配色 (根据暗色/亮色模式自动切换) ===== */
                ${isDark ? `
                .xhs-card-bg.s1 { background: #3D2222; color: #F5C6C6; }
                .xhs-card-bg.s1 .xhs-hl { --hl-color: rgba(252,129,129,0.5); }
                .xhs-card-bg.s1 .xhs-ul, .xhs-card-bg.s1 .xhs-wave { text-decoration-color: #FC8181; }
                .xhs-card-bg.s1 .xhs-deco { color: #7C3030; }

                .xhs-card-bg.s2 { background: #1E3A5F; color: #BEE3F8; }
                .xhs-card-bg.s2 .xhs-hl { --hl-color: rgba(99,179,237,0.5); }
                .xhs-card-bg.s2 .xhs-ul, .xhs-card-bg.s2 .xhs-wave { text-decoration-color: #63B3ED; }
                .xhs-card-bg.s2 .xhs-deco { color: #4A79A8; }

                .xhs-card-bg.s3 { background: #1C3D2D; color: #C6F6D5; }
                .xhs-card-bg.s3 .xhs-hl { --hl-color: rgba(104,211,145,0.5); }
                .xhs-card-bg.s3 .xhs-ul, .xhs-card-bg.s3 .xhs-wave { text-decoration-color: #68D391; }
                .xhs-card-bg.s3 .xhs-deco { color: #48BB78; }

                .xhs-card-bg.s4 { background: #2D2248; color: #E9D8FD; }
                .xhs-card-bg.s4 .xhs-hl { --hl-color: rgba(183,148,244,0.5); }
                .xhs-card-bg.s4 .xhs-ul, .xhs-card-bg.s4 .xhs-wave { text-decoration-color: #B794F4; }
                .xhs-card-bg.s4 .xhs-deco { color: #9F7AEA; }

                .xhs-card-bg.s5 { background: #3D3020; color: #FEEBC8; }
                .xhs-card-bg.s5 .xhs-hl { --hl-color: rgba(246,173,85,0.5); }
                .xhs-card-bg.s5 .xhs-ul, .xhs-card-bg.s5 .xhs-wave { text-decoration-color: #F6AD55; }
                .xhs-card-bg.s5 .xhs-deco { color: #ED8936; }

                .xhs-card-bg.s6 { background: #1A3D3D; color: #B2F5EA; }
                .xhs-card-bg.s6 .xhs-hl { --hl-color: rgba(79,209,197,0.5); }
                .xhs-card-bg.s6 .xhs-ul, .xhs-card-bg.s6 .xhs-wave { text-decoration-color: #4FD1C5; }
                .xhs-card-bg.s6 .xhs-deco { color: #38B2AC; }

                .xhs-card-bg.s7 { background: #3D3D1A; color: #FAF089; }
                .xhs-card-bg.s7 .xhs-hl { --hl-color: rgba(236,201,75,0.5); }
                .xhs-card-bg.s7 .xhs-ul, .xhs-card-bg.s7 .xhs-wave { text-decoration-color: #ECC94B; }
                .xhs-card-bg.s7 .xhs-deco { color: #D69E2E; }

                .xhs-card-bg.s8 { background: #3D1A2D; color: #FED7E2; }
                .xhs-card-bg.s8 .xhs-hl { --hl-color: rgba(246,135,179,0.5); }
                .xhs-card-bg.s8 .xhs-ul, .xhs-card-bg.s8 .xhs-wave { text-decoration-color: #F687B3; }
                .xhs-card-bg.s8 .xhs-deco { color: #ED64A6; }

                .xhs-card-bg.s9 { background: #1A3A3D; color: #C4F1F9; }
                .xhs-card-bg.s9 .xhs-hl { --hl-color: rgba(118,228,247,0.5); }
                .xhs-card-bg.s9 .xhs-ul, .xhs-card-bg.s9 .xhs-wave { text-decoration-color: #76E4F7; }
                .xhs-card-bg.s9 .xhs-deco { color: #0BC5EA; }

                .xhs-card-bg.s10 { background: #3D2A1A; color: #FFE4CA; }
                .xhs-card-bg.s10 .xhs-hl { --hl-color: rgba(255,159,90,0.5); }
                .xhs-card-bg.s10 .xhs-ul, .xhs-card-bg.s10 .xhs-wave { text-decoration-color: #FF9F5A; }
                .xhs-card-bg.s10 .xhs-deco { color: #ED8936; }
                ` : `
                .xhs-card-bg.s1 { background: #FFF5F5; color: #4A2C2C; }
                .xhs-card-bg.s1 .xhs-hl { --hl-color: rgba(254,178,178,0.6); }
                .xhs-card-bg.s1 .xhs-ul, .xhs-card-bg.s1 .xhs-wave { text-decoration-color: #FC8181; }
                .xhs-card-bg.s1 .xhs-deco { color: #FEB2B2; }

                .xhs-card-bg.s2 { background: #EBF8FF; color: #2A4365; }
                .xhs-card-bg.s2 .xhs-hl { --hl-color: rgba(144,205,244,0.6); }
                .xhs-card-bg.s2 .xhs-ul, .xhs-card-bg.s2 .xhs-wave { text-decoration-color: #63B3ED; }
                .xhs-card-bg.s2 .xhs-deco { color: #90CDF4; }

                .xhs-card-bg.s3 { background: #F0FFF4; color: #22543D; }
                .xhs-card-bg.s3 .xhs-hl { --hl-color: rgba(154,230,180,0.6); }
                .xhs-card-bg.s3 .xhs-ul, .xhs-card-bg.s3 .xhs-wave { text-decoration-color: #68D391; }
                .xhs-card-bg.s3 .xhs-deco { color: #9AE6B4; }

                .xhs-card-bg.s4 { background: #FAF5FF; color: #44337A; }
                .xhs-card-bg.s4 .xhs-hl { --hl-color: rgba(214,188,250,0.6); }
                .xhs-card-bg.s4 .xhs-ul, .xhs-card-bg.s4 .xhs-wave { text-decoration-color: #B794F4; }
                .xhs-card-bg.s4 .xhs-deco { color: #D6BCFA; }

                .xhs-card-bg.s5 { background: #FFFAF0; color: #744210; }
                .xhs-card-bg.s5 .xhs-hl { --hl-color: rgba(251,211,141,0.6); }
                .xhs-card-bg.s5 .xhs-ul, .xhs-card-bg.s5 .xhs-wave { text-decoration-color: #F6AD55; }
                .xhs-card-bg.s5 .xhs-deco { color: #FBD38D; }

                .xhs-card-bg.s6 { background: #E6FFFA; color: #234E52; }
                .xhs-card-bg.s6 .xhs-hl { --hl-color: rgba(129,230,217,0.6); }
                .xhs-card-bg.s6 .xhs-ul, .xhs-card-bg.s6 .xhs-wave { text-decoration-color: #4FD1C5; }
                .xhs-card-bg.s6 .xhs-deco { color: #81E6D9; }

                .xhs-card-bg.s7 { background: #FFFFF0; color: #5F370E; }
                .xhs-card-bg.s7 .xhs-hl { --hl-color: rgba(246,224,94,0.6); }
                .xhs-card-bg.s7 .xhs-ul, .xhs-card-bg.s7 .xhs-wave { text-decoration-color: #ECC94B; }
                .xhs-card-bg.s7 .xhs-deco { color: #F6E05E; }

                .xhs-card-bg.s8 { background: #FFF5F7; color: #521B41; }
                .xhs-card-bg.s8 .xhs-hl { --hl-color: rgba(251,182,206,0.6); }
                .xhs-card-bg.s8 .xhs-ul, .xhs-card-bg.s8 .xhs-wave { text-decoration-color: #F687B3; }
                .xhs-card-bg.s8 .xhs-deco { color: #FBB6CE; }

                .xhs-card-bg.s9 { background: #EDFDFD; color: #1D4044; }
                .xhs-card-bg.s9 .xhs-hl { --hl-color: rgba(157,236,249,0.6); }
                .xhs-card-bg.s9 .xhs-ul, .xhs-card-bg.s9 .xhs-wave { text-decoration-color: #76E4F7; }
                .xhs-card-bg.s9 .xhs-deco { color: #9DECF9; }

                .xhs-card-bg.s10 { background: #FFF8F1; color: #63351D; }
                .xhs-card-bg.s10 .xhs-hl { --hl-color: rgba(255,189,138,0.6); }
                .xhs-card-bg.s10 .xhs-ul, .xhs-card-bg.s10 .xhs-wave { text-decoration-color: #FF9F5A; }
                .xhs-card-bg.s10 .xhs-deco { color: #FFBD8A; }
                `}

                /* ===== 图片封面 ===== */
                .xhs-card-img-box {
                    position: relative;
                    width: 100%;
                    overflow: hidden;
                    background: ${isDark ? '#3d3d3d' : '#f0f0f0'};
                }

                .xhs-card-img-box.size-normal { height: 180px; }
                .xhs-card-img-box.size-tall { height: 240px; }
                @media (max-width: 520px) {
                    .xhs-card-img-box.size-normal { height: 150px; }
                    .xhs-card-img-box.size-tall { height: 200px; }
                }

                .xhs-card-img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    object-position: center;
                    opacity: 0;
                    transition: opacity 0.3s, transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .xhs-card-img.show { opacity: 1; }
                .xhs-card:hover .xhs-card-img.show { transform: scale(1.05); }

                .xhs-card-img-ph {
                    position: absolute;
                    inset: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: ${isDark ? 'linear-gradient(135deg, #3d3d3d, #2d2d2d)' : 'linear-gradient(135deg, #f5f5f5, #eee)'};
                    color: ${isDark ? '#666' : '#ccc'};
                    font-size: 24px;
                }
                .xhs-card-img.show ~ .xhs-card-img-ph { display: none; }

                .xhs-card-tag {
                    position: absolute;
                    top: 10px;
                    left: 10px;
                    background: ${isDark ? 'rgba(45,45,45,0.95)' : 'rgba(255,255,255,0.95)'};
                    color: var(--xhs-c);
                    font-size: 10px;
                    font-weight: 600;
                    padding: 4px 10px;
                    border-radius: 10px;
                    z-index: 2;
                    box-shadow: 0 2px 8px ${isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.08)'};
                    backdrop-filter: blur(8px);
                }
                @media (max-width: 520px) { .xhs-card-tag { font-size: 9px; padding: 3px 8px; } }

                .xhs-card-pin {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    background: linear-gradient(135deg, var(--xhs-c), var(--xhs-lighter));
                    color: #fff;
                    font-size: 10px;
                    font-weight: 600;
                    padding: 4px 10px;
                    border-radius: 10px;
                    z-index: 3;
                    box-shadow: 0 2px 8px rgba(var(--xhs-rgb), 0.3);
                }
                @media (max-width: 520px) { .xhs-card-pin { font-size: 9px; padding: 3px 8px; } }

                .xhs-card-count {
                    position: absolute;
                    bottom: 10px;
                    right: 10px;
                    background: rgba(0,0,0,0.65);
                    color: #fff;
                    font-size: 10px;
                    padding: 4px 10px;
                    border-radius: 10px;
                    z-index: 2;
                    display: none;
                    align-items: center;
                    gap: 4px;
                    backdrop-filter: blur(8px);
                }
                .xhs-card-count.show { display: flex; }

                .xhs-card-body {
                    padding: 14px;
                    display: flex;
                    flex-direction: column;
                    flex: 1;
                }
                @media (max-width: 520px) { .xhs-card-body { padding: 10px 12px; } }

                .xhs-card-title {
                    display: -webkit-box;
                    font-size: 14px;
                    font-weight: 600;
                    line-height: 1.45;
                    color: var(--xhs-text);
                    text-decoration: none;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    min-height: 2.9em;
                    margin-bottom: 12px;
                    transition: color 0.15s;
                }
                @media (max-width: 520px) { .xhs-card-title { font-size: 13px; margin-bottom: 10px; min-height: 2.9em; } }
                .xhs-card-title:hover { color: var(--xhs-c); }

                .xhs-card-meta {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-top: auto;
                }
                .xhs-card-author {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    min-width: 0;
                    flex: 1;
                }
                .xhs-card-avatar {
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    object-fit: cover;
                    flex-shrink: 0;
                    border: 2px solid var(--xhs-light);
                }
                @media (max-width: 520px) { .xhs-card-avatar { width: 20px; height: 20px; } }

                .xhs-card-name {
                    font-size: 12px;
                    color: var(--xhs-text-secondary);
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                @media (max-width: 520px) { .xhs-card-name { font-size: 11px; } }

                .xhs-card-like {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    font-size: 12px;
                    color: var(--xhs-text-muted);
                    padding: 6px 10px;
                    border-radius: 14px;
                    cursor: pointer;
                    transition: all 0.2s;
                    flex-shrink: 0;
                }
                @media (max-width: 520px) { .xhs-card-like { font-size: 11px; padding: 4px 8px; } }
                .xhs-card-like:hover {
                    background: var(--xhs-light);
                    color: var(--xhs-c);
                }
                .xhs-card-like .xhs-heart {
                    font-size: 15px;
                    transition: transform 0.2s;
                }
                .xhs-card-like:hover .xhs-heart { transform: scale(1.2); }
                .xhs-card-like.liked { color: var(--xhs-c); }

                .xhs-card-stats {
                    display: flex;
                    gap: 14px;
                    margin-top: 12px;
                    padding-top: 12px;
                    border-top: 1px solid var(--xhs-border);
                    font-size: 11px;
                    color: var(--xhs-text-muted);
                }
                @media (max-width: 520px) { .xhs-card-stats { gap: 10px; margin-top: 10px; padding-top: 10px; font-size: 10px; } }

                /* ===== 帖子详情页 ===== */
                body.xhs-on.xhs-topic { background: var(--xhs-bg) !important; }

                body.xhs-on.xhs-topic .topic-post {
                    background: var(--xhs-card-bg) !important;
                    border-radius: 20px !important;
                    margin-bottom: 16px !important;
                    box-shadow: 0 2px 12px var(--xhs-shadow) !important;
                    overflow: hidden !important;
                    border: none !important;
                }

                body.xhs-on.xhs-topic .topic-post:first-child {
                    border-top: 3px solid var(--xhs-c) !important;
                }

                body.xhs-on.xhs-topic .topic-post article.boxed {
                    display: flex !important;
                    flex-direction: row !important;
                }
                body.xhs-on.xhs-topic .topic-avatar {
                    order: -1 !important;
                    flex-shrink: 0 !important;
                    padding: 20px 0 20px 20px !important;
                }
                body.xhs-on.xhs-topic .topic-body {
                    flex: 1 !important;
                    min-width: 0 !important;
                    padding: 20px !important;
                }
                body.xhs-on.xhs-topic .topic-avatar .avatar {
                    width: 48px !important;
                    height: 48px !important;
                    border: 3px solid var(--xhs-light) !important;
                    border-radius: 50% !important;
                    box-shadow: 0 2px 8px rgba(var(--xhs-rgb), 0.15) !important;
                }

                body.xhs-on.xhs-topic .names .username a {
                    font-weight: 600 !important;
                    font-size: 15px !important;
                    color: var(--xhs-text) !important;
                }
                body.xhs-on.xhs-topic .names .username a:hover { color: var(--xhs-c) !important; }
                
                /* 深色模式帖子详情页文字颜色修复 */
                body.xhs-on.xhs-topic .topic-body,
                body.xhs-on.xhs-topic .topic-body *,
                body.xhs-on.xhs-topic .names,
                body.xhs-on.xhs-topic .names span,
                body.xhs-on.xhs-topic .names a,
                body.xhs-on.xhs-topic .post-infos,
                body.xhs-on.xhs-topic .post-date,
                body.xhs-on.xhs-topic .relative-date,
                body.xhs-on.xhs-topic .user-title,
                body.xhs-on.xhs-topic .full-name a,
                body.xhs-on.xhs-topic .second.username a {
                    color: var(--xhs-text) !important;
                }
                body.xhs-on.xhs-topic .post-infos,
                body.xhs-on.xhs-topic .post-date,
                body.xhs-on.xhs-topic .relative-date,
                body.xhs-on.xhs-topic .user-title {
                    color: var(--xhs-text-secondary) !important;
                }
                body.xhs-on.xhs-topic .post-controls .btn,
                body.xhs-on.xhs-topic .post-controls .d-icon,
                body.xhs-on.xhs-topic .actions .btn,
                body.xhs-on.xhs-topic .d-button-label {
                    color: var(--xhs-text-muted) !important;
                }
                body.xhs-on.xhs-topic .post-controls .btn:hover,
                body.xhs-on.xhs-topic .post-controls .btn:hover .d-icon {
                    color: var(--xhs-c) !important;
                }

                body.xhs-on.xhs-topic .cooked,
                body.xhs-on.xhs-topic .cooked p,
                body.xhs-on.xhs-topic .cooked li,
                body.xhs-on.xhs-topic .cooked span,
                body.xhs-on.xhs-topic .cooked div {
                    font-size: 15px !important;
                    line-height: 1.8 !important;
                    color: var(--xhs-text) !important;
                }

                body.xhs-on.xhs-topic .cooked a { color: var(--xhs-c) !important; }
                body.xhs-on.xhs-topic .cooked img:not(.emoji):not(.avatar) {
                    border-radius: 12px !important;
                    margin: 12px 0 !important;
                }
                body.xhs-on.xhs-topic .cooked blockquote {
                    border-left: 4px solid var(--xhs-c) !important;
                    background: var(--xhs-light) !important;
                    border-radius: 0 12px 12px 0 !important;
                    padding: 16px 20px !important;
                    margin: 16px 0 !important;
                }
                body.xhs-on.xhs-topic .cooked pre { border-radius: 12px !important; }
                body.xhs-on.xhs-topic .cooked code:not(pre code) {
                    background: var(--xhs-light) !important;
                    color: var(--xhs-c) !important;
                    padding: 2px 8px !important;
                    border-radius: 6px !important;
                }
                body.xhs-on.xhs-topic .post-controls .btn {
                    border-radius: 8px !important;
                }
                body.xhs-on.xhs-topic .post-controls .btn:hover {
                    background: var(--xhs-light) !important;
                    color: var(--xhs-c) !important;
                }
                body.xhs-on.xhs-topic .like-button.has-like,
                body.xhs-on.xhs-topic .like-button.has-like .d-icon {
                    color: var(--xhs-c) !important;
                }

                body.xhs-on #reply-control {
                    border-top: 3px solid var(--xhs-c) !important;
                    border-radius: 20px 20px 0 0 !important;
                    background: var(--xhs-card-bg) !important;
                    width: 100% !important;
                    left: 0 !important;
                    right: 0 !important;
                }
                /* 隐藏未激活的回复控件 */
                body.xhs-on #reply-control.closed {
                    display: none !important;
                }

                /* ===== 推荐话题等高网格布局 ===== */
                body.xhs-on.xhs-topic .topics .xhs-grid {
                    column-count: unset !important;
                    display: grid !important;
                    grid-template-columns: repeat(5, 1fr) !important;
                    gap: 16px !important;
                    padding: 20px 0 !important;
                }
                @media (max-width: 1400px) {
                    body.xhs-on.xhs-topic .topics .xhs-grid {
                        grid-template-columns: repeat(4, 1fr) !important;
                    }
                }
                @media (max-width: 1100px) {
                    body.xhs-on.xhs-topic .topics .xhs-grid {
                        grid-template-columns: repeat(3, 1fr) !important;
                    }
                }
                @media (max-width: 768px) {
                    body.xhs-on.xhs-topic .topics .xhs-grid {
                        grid-template-columns: repeat(2, 1fr) !important;
                        gap: 12px !important;
                    }
                }
                body.xhs-on.xhs-topic .topics .xhs-card {
                    margin-bottom: 0 !important;
                    height: 100% !important;
                    display: flex !important;
                    flex-direction: column !important;
                }
                body.xhs-on.xhs-topic .topics .xhs-card-cover {
                    flex-shrink: 0 !important;
                }
                body.xhs-on.xhs-topic .topics .xhs-card-bg {
                    min-height: 140px !important;
                    height: 140px !important;
                }
                body.xhs-on.xhs-topic .topics .xhs-card-bg.size-tall,
                body.xhs-on.xhs-topic .topics .xhs-card-bg.size-normal {
                    min-height: 140px !important;
                    height: 140px !important;
                }
                body.xhs-on.xhs-topic .topics .xhs-card-img-box {
                    height: 140px !important;
                }
                body.xhs-on.xhs-topic .topics .xhs-card-img-box.size-tall,
                body.xhs-on.xhs-topic .topics .xhs-card-img-box.size-normal {
                    height: 140px !important;
                }
                body.xhs-on.xhs-topic .topics .xhs-card-body {
                    flex: 1 !important;
                    display: flex !important;
                    flex-direction: column !important;
                    padding: 12px !important;
                }
                body.xhs-on.xhs-topic .topics .xhs-card-title {
                    font-size: 13px !important;
                    -webkit-line-clamp: 2 !important;
                    margin-bottom: 8px !important;
                    flex: 1 !important;
                }
                body.xhs-on.xhs-topic .topics .xhs-card-meta {
                    margin-top: auto !important;
                }
                body.xhs-on.xhs-topic .topics .xhs-card-stats {
                    display: none !important;
                }
                body.xhs-on.xhs-topic .topics .xhs-card-emoji {
                    font-size: 24px !important;
                    margin-bottom: 8px !important;
                }
                body.xhs-on.xhs-topic .topics .xhs-card-excerpt {
                    font-size: 12px !important;
                    line-height: 1.6 !important;
                    -webkit-line-clamp: 3 !important;
                }

                /* ===== 话题底部按钮小红书风格 ===== */
                body.xhs-on.xhs-topic .topic-footer-main-buttons {
                    background: var(--xhs-card-bg) !important;
                    border-radius: 16px !important;
                    padding: 12px 16px !important;
                    margin: 16px 0 !important;
                    box-shadow: 0 2px 12px var(--xhs-shadow) !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: space-between !important;
                    gap: 12px !important;
                }
                body.xhs-on.xhs-topic .topic-footer-main-buttons__actions {
                    display: flex !important;
                    gap: 8px !important;
                    flex-wrap: wrap !important;
                }
                body.xhs-on.xhs-topic .topic-footer-button {
                    background: var(--xhs-light) !important;
                    border: none !important;
                    border-radius: 20px !important;
                    padding: 8px 16px !important;
                    font-size: 13px !important;
                    font-weight: 500 !important;
                    color: var(--xhs-c) !important;
                    transition: all 0.2s !important;
                    display: inline-flex !important;
                    align-items: center !important;
                    gap: 6px !important;
                }
                body.xhs-on.xhs-topic .topic-footer-button .d-button-label,
                body.xhs-on.xhs-topic .topic-footer-button span {
                    color: var(--xhs-c) !important;
                }
                /* 回复按钮(btn-primary)文字为白色 */
                body.xhs-on.xhs-topic .topic-footer-button.btn-primary .d-button-label,
                body.xhs-on.xhs-topic .topic-footer-button.btn-primary span {
                    color: #fff !important;
                }
                body.xhs-on.xhs-topic .topic-footer-button:hover {
                    background: rgba(var(--xhs-rgb), 0.2) !important;
                    transform: translateY(-1px) !important;
                }
                body.xhs-on.xhs-topic .topic-footer-button svg {
                    width: 14px !important;
                    height: 14px !important;
                    fill: var(--xhs-c) !important;
                }
                body.xhs-on.xhs-topic .topic-footer-button.btn-primary {
                    background: linear-gradient(135deg, var(--xhs-c), var(--xhs-lighter)) !important;
                    color: #fff !important;
                    padding: 10px 24px !important;
                    font-weight: 600 !important;
                    box-shadow: 0 4px 12px rgba(var(--xhs-rgb), 0.3) !important;
                }
                body.xhs-on.xhs-topic .topic-footer-button.btn-primary:hover {
                    box-shadow: 0 6px 20px rgba(var(--xhs-rgb), 0.4) !important;
                    transform: translateY(-2px) !important;
                }
                body.xhs-on.xhs-topic .topic-footer-button.btn-primary svg {
                    fill: #fff !important;
                }

                /* ===== 全局通知浅色主题 ===== */
                body.xhs-on .global-notice .alert-global-notice {
                    background: var(--xhs-light) !important;
                    border: 1px solid rgba(var(--xhs-rgb), 0.15) !important;
                    border-radius: 12px !important;
                    color: var(--xhs-c) !important;
                    padding: 12px 20px !important;
                    margin: 12px 0 !important;
                }
                body.xhs-on .global-notice .alert-global-notice .text {
                    color: #333 !important;
                }
                body.xhs-on .global-notice .alert-global-notice .text strong {
                    color: var(--xhs-c) !important;
                    font-weight: 600 !important;
                }
                body.xhs-on .global-notice .alert-global-notice .text a {
                    color: var(--xhs-c) !important;
                    font-weight: 500 !important;
                    text-decoration: none !important;
                    border-bottom: 1px dashed var(--xhs-c) !important;
                }
                body.xhs-on .global-notice .alert-global-notice .text a:hover {
                    border-bottom-style: solid !important;
                }

                /* ===== 深色模式全局通知适配 ===== */
                body.xhs-on.xhs-dark .global-notice .alert-global-notice {
                    background: rgba(var(--xhs-rgb), 0.12) !important;
                    border-color: rgba(var(--xhs-rgb), 0.25) !important;
                }
                body.xhs-on.xhs-dark .global-notice .alert-global-notice .text {
                    color: #e0e0e0 !important;
                }
                body.xhs-on.xhs-dark .global-notice .alert-global-notice .text strong {
                    color: var(--xhs-c) !important;
                }
                body.xhs-on.xhs-dark .global-notice .alert-global-notice .text a {
                    color: var(--xhs-c) !important;
                }

                /* ===== 帖子详情页分类/标签区域样式 ===== */
                body.xhs-on.xhs-topic .topic-category.ember-view {
                    background: var(--xhs-card-bg) !important;
                    border-radius: 12px !important;
                    padding: 12px 16px !important;
                    margin-bottom: 12px !important;
                }
                /* 深色模式分类区域文字 */
                body.xhs-on.xhs-dark.xhs-topic .topic-category,
                body.xhs-on.xhs-dark.xhs-topic .topic-category *,
                body.xhs-on.xhs-dark.xhs-topic .topic-category .badge-category__wrapper,
                body.xhs-on.xhs-dark.xhs-topic .topic-category .badge-category,
                body.xhs-on.xhs-dark.xhs-topic .topic-category .badge-category__name,
                body.xhs-on.xhs-dark.xhs-topic .topic-category a {
                    color: #e0e0e0 !important;
                }
                body.xhs-on.xhs-dark.xhs-topic .topic-category .badge-category__wrapper:hover,
                body.xhs-on.xhs-dark.xhs-topic .topic-category .badge-category:hover,
                body.xhs-on.xhs-dark.xhs-topic .topic-category a:hover {
                    color: var(--xhs-c) !important;
                }

                /* 深色模式标签区域 */
                body.xhs-on.xhs-dark.xhs-topic .topic-header-extra,
                body.xhs-on.xhs-dark.xhs-topic .topic-header-extra *,
                body.xhs-on.xhs-dark.xhs-topic .list-tags,
                body.xhs-on.xhs-dark.xhs-topic .discourse-tags,
                body.xhs-on.xhs-dark.xhs-topic .discourse-tags *,
                body.xhs-on.xhs-dark.xhs-topic .discourse-tag,
                body.xhs-on.xhs-dark.xhs-topic a.discourse-tag {
                    color: #aaaaaa !important;
                }
                body.xhs-on.xhs-dark.xhs-topic .discourse-tag:hover,
                body.xhs-on.xhs-dark.xhs-topic a.discourse-tag:hover {
                    color: var(--xhs-c) !important;
                }
                body.xhs-on.xhs-dark.xhs-topic .discourse-tag .tag-icon svg {
                    opacity: 0.85 !important;
                }
                body.xhs-on.xhs-dark.xhs-topic .discourse-tags__tag-separator {
                    color: #888888 !important;
                }

                /* 深色模式帖子详情页其他亮色元素适配 */
                body.xhs-on.xhs-dark.xhs-topic [style*="background-color: var(--primary-very-low)"],
                body.xhs-on.xhs-dark.xhs-topic [style*="background: var(--primary-very-low)"] {
                    background-color: #2d2d2d !important;
                    background: #2d2d2d !important;
                }
            `;

            const style = document.createElement('style');
            style.id = this.themeStyleId;
            style.textContent = css;
            document.head.appendChild(style);
        },

        removeTheme() {
            document.getElementById(this.themeStyleId)?.remove();
        }
    };

    /* ============================================
     * 设置面板模块
     * ============================================ */
    const Panel = {
        btn: null,
        panel: null,
        overlay: null,

        create() {
            const li = document.createElement('li');
            li.innerHTML = `
                <div class="xhs-btn ${Config.get().enabled ? 'on' : 'off'}" title="小L书设置">
                    <span style="font-size:20px;line-height:1;">🍠</span>
                </div>
            `;
            this.btn = li.querySelector('.xhs-btn');

            this.overlay = document.createElement('div');
            this.overlay.className = 'xhs-overlay';

            this.panel = document.createElement('div');
            this.panel.className = 'xhs-panel';
            this.panel.innerHTML = this._template();

            document.body.append(this.overlay, this.panel);
            document.querySelector('.d-header-icons')?.prepend(li);

            this._bindEvents();
        },

        _template() {
            const config = Config.get();
            return `
                <div class="xhs-panel-header">
                    <div class="xhs-panel-title">
                        <span>🍠</span>
                        <span>小L书</span>
                        <span class="xhs-panel-ver">v2.6</span>
                    </div>
                    <div class="xhs-panel-close">×</div>
                </div>
                <div class="xhs-panel-body">
                    <div class="xhs-section">
                        <div class="xhs-section-title">基础设置</div>
                        <div class="xhs-row">
                            <div class="xhs-row-info">
                                <span class="xhs-row-icon">✨</span>
                                <div>
                                    <div class="xhs-row-label">启用小L书</div>
                                    <div class="xhs-row-desc">瀑布流卡片布局</div>
                                </div>
                            </div>
                            <div class="xhs-switch ${config.enabled ? 'on' : ''}" data-key="enabled"></div>
                        </div>
                        <div class="xhs-row">
                            <div class="xhs-row-info">
                                <span class="xhs-row-icon">📐</span>
                                <div>
                                    <div class="xhs-row-label">卡片错落布局</div>
                                    <div class="xhs-row-desc">开启瀑布流，关闭行布局等高</div>
                                </div>
                            </div>
                            <div class="xhs-switch ${config.cardStagger ? 'on' : ''}" data-key="cardStagger"></div>
                        </div>
                        <div class="xhs-row">
                            <div class="xhs-row-info">
                                <span class="xhs-row-icon">📊</span>
                                <div>
                                    <div class="xhs-row-label">显示统计信息</div>
                                    <div class="xhs-row-desc">回复数和浏览数</div>
                                </div>
                            </div>
                            <div class="xhs-switch ${config.showStats ? 'on' : ''}" data-key="showStats"></div>
                        </div>
                        <div class="xhs-row">
                            <div class="xhs-row-info">
                                <span class="xhs-row-icon">🌙</span>
                                <div>
                                    <div class="xhs-row-label">暗色模式</div>
                                    <div class="xhs-row-desc">适配 Dark Reader 等扩展</div>
                                </div>
                            </div>
                            <select class="xhs-select" data-key="darkMode">
                                <option value="auto" ${config.darkMode === 'auto' ? 'selected' : ''}>跟随系统</option>
                                <option value="light" ${config.darkMode === 'light' ? 'selected' : ''}>始终亮色</option>
                                <option value="dark" ${config.darkMode === 'dark' ? 'selected' : ''}>始终暗色</option>
                            </select>
                        </div>
                    </div>
                    <div class="xhs-section">
                        <div class="xhs-section-title">主题颜色</div>
                        <div class="xhs-colors">
                            ${Object.entries(Config.themes).map(([name, color]) => `
                                <div class="xhs-color ${config.themeColor === color ? 'on' : ''}" data-color="${color}" style="color:${color}">
                                    <div class="xhs-color-dot" style="background:${color}"></div>
                                    <span class="xhs-color-name">${name}</span>
                                </div>
                            `).join('')}
                        </div>
                        <div class="xhs-custom">
                            <input type="color" class="xhs-picker" value="${config.themeColor}">
                            <span class="xhs-custom-label">自定义颜色</span>
                        </div>
                    </div>
                </div>
                <div class="xhs-panel-footer">
                    <div class="xhs-footer-links">
                        <span class="xhs-footer-author">by <a href="https://linux.do/u/jackyliii/summary" target="_blank">JackyLiii</a></span>
                        <a href="https://github.com/caigg188/littleLBook" target="_blank" class="xhs-github-link" title="给个 Star 支持一下吧~">
                            <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path></svg>
                            <span class="star-icon">⭐</span> Star
                        </a>
                    </div>
                    <span class="xhs-reset">重置设置</span>
                </div>
            `;
        },

        _bindEvents() {
            this.btn.onclick = (e) => { e.stopPropagation(); this.toggle(); };
            this.panel.querySelector('.xhs-panel-close').onclick = () => this.close();
            this.overlay.onclick = () => this.close();

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.panel.classList.contains('show')) this.close();
            });

            this.panel.querySelectorAll('.xhs-switch').forEach(sw => {
                sw.onclick = () => {
                    const key = sw.dataset.key;
                    const val = !Config.get()[key];
                    Config.set(key, val);
                    sw.classList.toggle('on', val);
                    if (key === 'enabled') {
                        this.btn.classList.toggle('on', val);
                        this.btn.classList.toggle('off', !val);
                    }
                    // 布局模式切换需要重置并重新渲染
                    if (key === 'cardStagger') {
                        Grid.reset();
                    }
                    App.apply();
                };
            });

            this.panel.querySelectorAll('.xhs-color').forEach(el => {
                el.onclick = () => {
                    Config.set('themeColor', el.dataset.color);
                    this.panel.querySelectorAll('.xhs-color').forEach(c => c.classList.remove('on'));
                    el.classList.add('on');
                    this.panel.querySelector('.xhs-picker').value = el.dataset.color;
                    Styles.injectTheme();
                };
            });

            this.panel.querySelector('.xhs-picker').oninput = (e) => {
                Config.set('themeColor', e.target.value);
                this.panel.querySelectorAll('.xhs-color').forEach(c => c.classList.remove('on'));
                Styles.injectTheme();
            };

            // 暗色模式选择
            this.panel.querySelector('.xhs-select[data-key="darkMode"]').onchange = (e) => {
                const val = e.target.value;
                Config.set('darkMode', val);
                EarlyStyles.cacheDarkMode(val);
                Styles.injectTheme();
                Grid.reset();
                Grid.render();
            };

            this.panel.querySelector('.xhs-reset').onclick = () => {
                if (confirm('确定重置所有设置？')) {
                    Config.reset();
                    location.reload();
                }
            };
        },

        toggle() {
            const isOpen = this.panel.classList.contains('show');
            if (isOpen) this.close(); else this.open();
        },

        open() {
            this.panel.classList.add('show');
            this.overlay.classList.add('show');
        },

        close() {
            this.panel.classList.remove('show');
            this.overlay.classList.remove('show');
        }
    };

    /* ============================================
     * 瀑布流模块
     * ============================================ */
    const Grid = {
        container: null,
        index: 0,
        seen: new Set(),
        cache: new Map(),
        observer: null,
        loadQueue: [],
        isLoading: false,
        concurrency: 3, // 降低并发数，避免请求过快
        
        // 速率限制和退避策略
        rateLimiter: {
            requestCount: 0,           // 当前时间窗口内的请求数
            windowStart: Date.now(),   // 时间窗口开始时间
            maxRequestsPerWindow: 30,  // 每个时间窗口最大请求数
            windowDuration: 10000,     // 时间窗口长度（10秒）
            minInterval: 200,          // 请求最小间隔（毫秒）
            lastRequestTime: 0,        // 上次请求时间
            failureCount: 0,           // 连续失败次数
            cooldownUntil: 0,          // 冷却结束时间
            baseCooldown: 5000,        // 基础冷却时间（5秒）
            maxCooldown: 60000,        // 最大冷却时间（60秒）
        },

        styles: ['s1', 's2', 's3', 's4', 's5', 's6', 's7', 's8', 's9', 's10'],

        cornerDecos: [
            // 边框角
            '╭', '╮', '╰', '╯', '┌', '┐', '└', '┘', '「', '」', '『', '』',
            // 圆点系列
            '•', '◦', '○', '◌', '◍', '◎', '●', '◐', '◑', '◒', '◓',
            // 几何图形
            '✧', '✦', '◇', '◆', '△', '▽', '▷', '◁', '□', '■', '▪', '▫',
            // 花朵植物
            '✿', '❀', '❁', '✾', '❃', '❋', '✻', '✼', '❊', '✽',
            // 星星
            '✩', '✪', '✫', '☆', '★', '✡', '✴', '✵', '✶', '✷', '✸', '✹',
            // 爱心
            '♡', '♥', '❤', '💕', '💗',
            // 自然元素
            '🌿', '☘', '🍃', '🌸', '🌺', '🌼', '🌻', '✨', '⭐', '🔥', '💫',
            // 箭头装饰
            '→', '←', '↑', '↓', '➤', '➜', '➔',
            // 其他装饰
            '※', '†', '‡', '§', '¶', '∞', '≈', '~', '♪', '♫'
        ],

        lineChars: ['·', '•', '◦', '○', '◌', '─', '┄', '┈', '╌', '╍', '∙', '⋅', '⋯', '═', '━', '~', '∼', '≈', '⋆', '★', '☆'],

        emojis: [
            '💻', '🚀', '✨', '💡', '🔥', '📝', '🎯', '📚', '🌟', '💬',
            '🔧', '🎉', '🎨', '📱', '🔮', '🌈', '☕', '🎵', '🎮', '💎',
            '🏆', '🪴', '🌺', '🦋', '🌙', '⚡', '📸', '🎤', '💿', '🖥️'
        ],

        init() {
            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const card = entry.target;
                        const tid = card.dataset.tid;
                        if (tid && !card.dataset.queued) {
                            card.dataset.queued = '1';
                            this._queueLoad(card, tid, true); // 优先级高
                        }
                    }
                });
            }, { rootMargin: '600px 0px', threshold: 0.01 }); // 增加预加载范围
        },

        _queueLoad(card, tid, priority = false) {
            const item = { card, tid };
            if (priority) {
                this.loadQueue.unshift(item); // 优先加载可见的
            } else {
                this.loadQueue.push(item);
            }
            this._processQueue();
        },

        // 检查是否可以发起请求（速率限制）
        _canRequest() {
            const now = Date.now();
            const rl = this.rateLimiter;
            
            // 检查是否在冷却期
            if (now < rl.cooldownUntil) {
                return false;
            }
            
            // 重置时间窗口
            if (now - rl.windowStart > rl.windowDuration) {
                rl.windowStart = now;
                rl.requestCount = 0;
            }
            
            // 检查时间窗口内的请求数限制
            if (rl.requestCount >= rl.maxRequestsPerWindow) {
                return false;
            }
            
            // 检查最小间隔
            if (now - rl.lastRequestTime < rl.minInterval) {
                return false;
            }
            
            return true;
        },
        
        // 记录请求
        _recordRequest() {
            const now = Date.now();
            this.rateLimiter.requestCount++;
            this.rateLimiter.lastRequestTime = now;
        },
        
        // 请求成功，重置失败计数
        _onRequestSuccess() {
            this.rateLimiter.failureCount = 0;
        },
        
        // 请求失败，应用退避策略
        _onRequestFailure(statusCode) {
            const rl = this.rateLimiter;
            rl.failureCount++;
            
            // 如果是 429 (Too Many Requests) 或 5xx 错误，应用更长的冷却
            let cooldownMultiplier = 1;
            if (statusCode === 429) {
                cooldownMultiplier = 4; // 429 错误冷却时间翻4倍
            } else if (statusCode >= 500) {
                cooldownMultiplier = 2; // 5xx 错误冷却时间翻倍
            }
            
            // 指数退避：每次连续失败，冷却时间翻倍
            const cooldown = Math.min(
                rl.baseCooldown * Math.pow(2, rl.failureCount - 1) * cooldownMultiplier,
                rl.maxCooldown
            );
            
            rl.cooldownUntil = Date.now() + cooldown;
            console.log(`[小L书] 请求失败，进入冷却期 ${cooldown / 1000} 秒`);
            
            // 显示冷却提示给用户
            this._showCooldownNotice(cooldown, statusCode);
        },
        
        // 显示冷却提示给用户
        _showCooldownNotice(cooldown, statusCode) {
            // 移除旧的提示
            const oldNotice = document.querySelector('.xhs-cooldown-notice');
            if (oldNotice) oldNotice.remove();
            
            // 创建提示元素
            const notice = document.createElement('div');
            notice.className = 'xhs-cooldown-notice';
            
            let message = '图片加载暂停';
            if (statusCode === 429) {
                message = '请求过于频繁，暂停加载';
            } else if (statusCode >= 500) {
                message = '服务器繁忙，暂停加载';
            } else if (statusCode === 408) {
                message = '请求超时，暂停加载';
            }
            
            const seconds = Math.ceil(cooldown / 1000);
            notice.innerHTML = `
                <span class="xhs-cooldown-icon">⏸️</span>
                <span class="xhs-cooldown-text">${message}，${seconds}秒后恢复</span>
            `;
            
            // 添加样式
            notice.style.cssText = `
                position: fixed;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: linear-gradient(135deg, var(--xhs-c, #ff2442), var(--xhs-lighter, #ff6b81));
                color: #fff;
                padding: 12px 24px;
                border-radius: 24px;
                font-size: 14px;
                font-weight: 500;
                z-index: 99999;
                box-shadow: 0 4px 20px rgba(0,0,0,0.2);
                display: flex;
                align-items: center;
                gap: 8px;
                animation: xhs-notice-in 0.3s ease;
            `;
            
            document.body.appendChild(notice);
            
            // 自动移除
            setTimeout(() => {
                notice.style.animation = 'xhs-notice-out 0.3s ease forwards';
                setTimeout(() => notice.remove(), 300);
            }, Math.min(cooldown, 5000));
        },
        
        // 计算下次可请求的等待时间
        _getWaitTime() {
            const now = Date.now();
            const rl = this.rateLimiter;
            
            // 如果在冷却期，返回剩余冷却时间
            if (now < rl.cooldownUntil) {
                return rl.cooldownUntil - now;
            }
            
            // 如果达到窗口限制，等待窗口重置
            if (rl.requestCount >= rl.maxRequestsPerWindow) {
                return rl.windowStart + rl.windowDuration - now;
            }
            
            // 确保最小间隔
            const timeSinceLastRequest = now - rl.lastRequestTime;
            if (timeSinceLastRequest < rl.minInterval) {
                return rl.minInterval - timeSinceLastRequest;
            }
            
            return 0;
        },

        async _processQueue() {
            if (this.isLoading || this.loadQueue.length === 0) return;
            
            // 检查速率限制
            if (!this._canRequest()) {
                const waitTime = this._getWaitTime();
                if (waitTime > 0) {
                    setTimeout(() => this._processQueue(), waitTime + 50);
                    return;
                }
            }

            this.isLoading = true;
            
            // 批量处理，但受速率限制
            const batch = this.loadQueue.splice(0, this.concurrency);
            await Promise.allSettled(batch.map(({ card, tid }) => this._loadImage(card, tid)));
            this.isLoading = false;

            if (this.loadQueue.length > 0) {
                // 添加固定延迟，避免请求过快
                const delay = this.rateLimiter.failureCount > 0 ? 500 : 150;
                setTimeout(() => this._processQueue(), delay);
            }
        },

        render() {
            if (!Config.get().enabled || !Utils.isListPage()) return;

            const topics = this._extract();
            if (!topics.length) return;

            if (!this.container) {
                this.container = document.createElement('div');
                this.container.className = 'xhs-grid';

                const list = document.querySelector('.topic-list');
                if (list?.parentNode) {
                    list.parentNode.insertBefore(this.container, list);
                }
            }

            const pinned = topics.filter(t => t.pinned);
            const normal = topics.filter(t => !t.pinned);

            // 根据配置设置布局模式
            const config = Config.get();
            if (config.cardStagger) {
                this.container.classList.remove('grid-mode');
            } else {
                this.container.classList.add('grid-mode');
            }

            const frag = document.createDocumentFragment();
            [...pinned, ...normal].forEach(t => frag.appendChild(this._createCard(t)));
            this.container.appendChild(frag);
        },

        reset() {
            this.seen.clear();
            this.index = 0;
            this.loadQueue = [];
            this.container?.remove();
            this.container = null;
        },

        _extract() {
            const topics = [];
            const rows = document.querySelectorAll('tbody.topic-list-body > tr[data-topic-id]');

            rows.forEach(row => {
                const tid = row.dataset.topicId;
                if (!tid || this.seen.has(tid)) return;

                const link = row.querySelector('a.raw-topic-link');
                if (!link) return;

                const title = link.textContent?.trim();
                const href = link.getAttribute('href');
                if (!title || !href) return;

                this.seen.add(tid);

                const isLiked = row.classList.contains('liked') ||
                    row.querySelector('.topic-list-data.liked') !== null ||
                    row.querySelector('.likes a')?.classList.contains('has-like');

                topics.push({
                    tid, title, href,
                    pinned: row.classList.contains('pinned'),
                    category: row.querySelector('.badge-category__name')?.textContent?.trim() || '',
                    avatar: row.querySelector('td.posters img.avatar')?.src || '',
                    user: row.querySelector('td.posters a[data-user-card]')?.dataset.userCard || '',
                    replies: row.querySelector('td.posts .number')?.textContent?.trim() || '0',
                    views: row.querySelector('td.views .number')?.textContent?.trim() || '0',
                    likes: row.querySelector('.likes .number')?.textContent?.trim() || '0',
                    excerpt: row.querySelector('.topic-excerpt span[dir="auto"]')?.textContent?.trim() || title,
                    liked: isLiked
                });
            });
            return topics;
        },

        _processText(text, seed) {
            const rand = Utils.seededRandom(seed);

            // 预处理：识别数字+单位组合（如 11点半、20个、100元）
            const processedText = text.replace(/(\d+)([点时分秒个元块万千百十号月日年岁度层楼条篇章节页次遍种类项步招式款台部辆套件把张])/g, '【NUM$1$2NUM】');
            
            // 分词：中文词组 / 英文单词(含数字) / 被标记的数字单位 / 空白 / 标点 / 单个中文字
            const segments = processedText.match(/【NUM[^】]+NUM】|[\u4e00-\u9fa5]{2,}|[a-zA-Z][a-zA-Z0-9]*|[0-9]+|\s+|[^\u4e00-\u9fa5a-zA-Z0-9\s【】]+|[\u4e00-\u9fa5]/g) || [text];

            // 还原被标记的数字单位组合
            const cleanSegments = segments.map(s => s.replace(/【NUM|NUM】/g, ''));

            // 常见无意义词
            const skipWords = new Set(['的', '了', '是', '在', '有', '和', '与', '我', '你', '也', '都', '就', '这', '而', '可', '一个', '一下', '什么', '怎么', '这个', '那个', '还是', '或者', '但是', '那些', '这些', '为了', '因为', 'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'this', 'that', 'with']);

            // 重要关键词（优先标记）
            const importantPatterns = [
                /^【NUM.*NUM】$/, // 数字+单位
                /脚本|插件|工具|软件|网站|教程|攻略|方法|技巧|推荐|分享|免费|开源|源码|代码|项目|框架|模板|配置/,
                /[A-Z][a-z]+[A-Z]|[a-z]+[A-Z]/, // 驼峰命名
                /^\d+[%％]$/, // 百分比
            ];

            const markableIndices = [];
            const importantIndices = [];
            
            cleanSegments.forEach((seg, idx) => {
                const trimmed = seg.trim();
                const lower = trimmed.toLowerCase();
                if (skipWords.has(lower) || skipWords.has(trimmed)) return;
                if (!trimmed || /^\s+$/.test(trimmed)) return;

                // 检查原始segment是否为数字单位组合
                const originalSeg = segments[idx];
                const isNumUnit = /^【NUM.*NUM】$/.test(originalSeg);
                
                // 检查是否为重要关键词
                const isImportant = isNumUnit || importantPatterns.some(p => p.test(trimmed));
                if (isImportant) {
                    importantIndices.push(idx);
                    return;
                }

                // 中文至少2个字，英文至少3字母
                if (/^[\u4e00-\u9fa5]{2,}$/.test(trimmed) || /^[a-zA-Z]{3,}[a-zA-Z0-9]*$/.test(trimmed)) {
                    markableIndices.push(idx);
                }
            });

            // 合并索引，重要词优先
            const allMarkable = [...new Set([...importantIndices, ...markableIndices])];

            // 如果没有符合条件的词，直接返回
            if (allMarkable.length === 0) {
                return Utils.escapeHtml(text);
            }

            // 标记数量：1-3个词
            const markCount = Math.max(1, Math.min(3, Math.ceil(allMarkable.length * (0.3 + rand() * 0.2))));

            // 优先选择重要词，然后随机补充普通词
            const toMark = [];
            importantIndices.slice(0, markCount).forEach(i => toMark.push(i));
            if (toMark.length < markCount) {
                const remaining = markableIndices.filter(i => !toMark.includes(i));
                const shuffled = remaining.sort(() => rand() - 0.5);
                toMark.push(...shuffled.slice(0, markCount - toMark.length));
            }

            // 效果类型和权重 - 高亮和波浪线视觉效果最明显，权重最高
            const effects = [
                { cls: 'xhs-hl', weight: 35 },      // 荧光笔高亮（最醒目）
                { cls: 'xhs-wave', weight: 30 },    // 波浪线（很醒目）
                { cls: 'xhs-ul', weight: 15 },      // 下划线
                { cls: 'xhs-bd', weight: 12 },      // 加粗
                { cls: 'xhs-dot', weight: 8 }       // 加点
            ];
            const totalWeight = effects.reduce((sum, e) => sum + e.weight, 0);

            // 根据权重随机选择效果
            const pickEffect = () => {
                let r = rand() * totalWeight;
                for (const e of effects) {
                    r -= e.weight;
                    if (r <= 0) return e.cls;
                }
                return effects[0].cls;
            };

            // 为每个选中的词分配效果 - 直接按权重随机，不强制避免重复
            const effectMap = new Map();
            toMark.forEach(idx => {
                effectMap.set(idx, pickEffect());
            });

            // 渲染结果
            return cleanSegments.map((seg, idx) => {
                const escaped = Utils.escapeHtml(seg);
                const effect = effectMap.get(idx);
                if (effect) {
                    return `<span class="${effect}">${escaped}</span>`;
                }
                return escaped;
            }).join('');
        },

        _generateDecos(seed) {
            const rand = Utils.seededRandom(seed + '_deco');
            let html = '';

            // 角落装饰：0-4个，大部分集中在2-3个
            // 权重分布: 0个(5%), 1个(10%), 2个(35%), 3个(35%), 4个(15%)
            const corners = ['tl', 'tr', 'bl', 'br'];
            const r = rand();
            let cornerCount;
            if (r < 0.05) cornerCount = 0;
            else if (r < 0.15) cornerCount = 1;
            else if (r < 0.50) cornerCount = 2;
            else if (r < 0.85) cornerCount = 3;
            else cornerCount = 4;

            const selectedCorners = [...corners].sort(() => rand() - 0.5).slice(0, cornerCount);

            selectedCorners.forEach(pos => {
                const deco = this.cornerDecos[Math.floor(rand() * this.cornerDecos.length)];
                html += `<span class="xhs-deco corner ${pos}">${deco}</span>`;
            });

            // 线条装饰：50%概率出现（增加频率）
            if (rand() < 0.5) {
                const lineChar = this.lineChars[Math.floor(rand() * this.lineChars.length)];
                const count = 5 + Math.floor(rand() * 5);
                const pos = rand() > 0.5 ? 'line-t' : 'line-b';
                html += `<span class="xhs-deco line ${pos}">${lineChar.repeat(count)}</span>`;
            }

            return html;
        },

        _createCard(t) {
            const i = this.index++;
            const card = document.createElement('div');
            card.className = 'xhs-card';
            card.dataset.tid = t.tid;

            const config = Config.get();
            const showStats = config.showStats;
            const rand = Utils.seededRandom(t.tid);

            // 错落模式：根据内容长度决定卡片高度
            // 行模式：统一高度
            let sizeClass = 'size-normal';
            if (config.cardStagger) {
                const textLen = t.excerpt.length;
                if (textLen > 80) {
                    sizeClass = 'size-tall';
                } else if (textLen > 30) {
                    sizeClass = rand() > 0.5 ? 'size-tall' : 'size-normal';
                }
            }
            const styleClass = this.styles[Math.floor(rand() * this.styles.length)];
            const emoji = this.emojis[Math.floor(rand() * this.emojis.length)];

            const excerptHtml = this._processText(t.excerpt, t.tid);
            const decosHtml = this._generateDecos(t.tid);

            const likedClass = t.liked ? 'liked' : '';
            const heartSymbol = t.liked ? '❤️' : '♡';

            card.innerHTML = `
                <a class="xhs-card-cover" href="${t.href}">
                    <div class="xhs-card-bg ${styleClass} ${sizeClass}">
                        ${decosHtml}
                        <span class="xhs-card-emoji">${emoji}</span>
                        <p class="xhs-card-excerpt">${excerptHtml}</p>
                    </div>
                    <div class="xhs-card-img-box ${sizeClass}" style="display:none;">
                        <img class="xhs-card-img" alt="">
                        <div class="xhs-card-img-ph">📷</div>
                    </div>
                    ${t.category ? `<span class="xhs-card-tag">${Utils.escapeHtml(t.category)}</span>` : ''}
                    ${t.pinned ? '<span class="xhs-card-pin">📌 置顶</span>' : ''}
                    <span class="xhs-card-count"></span>
                </a>
                <div class="xhs-card-body">
                    <a class="xhs-card-title" href="${t.href}">${Utils.escapeHtml(t.title)}</a>
                    <div class="xhs-card-meta">
                        <div class="xhs-card-author">
                            <img class="xhs-card-avatar" src="${t.avatar || '/images/default-avatar.png'}" alt="" loading="lazy" onerror="this.src='/images/default-avatar.png'">
                            <span class="xhs-card-name">${Utils.escapeHtml(t.user || '匿名')}</span>
                        </div>
                        <span class="xhs-card-like ${likedClass}">
                            <span class="xhs-heart">${heartSymbol}</span>
                            <span>${Utils.formatNumber(t.likes)}</span>
                        </span>
                    </div>
                    ${showStats ? `
                        <div class="xhs-card-stats">
                            <span>💬 ${Utils.formatNumber(t.replies)}</span>
                            <span>👁️ ${Utils.formatNumber(t.views)}</span>
                        </div>
                    ` : ''}
                </div>
            `;

            this.observer.observe(card);
            return card;
        },

        async _loadImage(card, tid) {
            let data = this.cache.get(tid);

            if (!data) {
                // 记录请求（用于速率限制统计）
                this._recordRequest();
                
                try {
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 8000); // 增加超时时间

                    const res = await fetch(`/t/topic/${tid}.json`, {
                        signal: controller.signal,
                        headers: { 'Accept': 'application/json' },
                        priority: 'low'
                    });

                    clearTimeout(timeoutId);
                    
                    if (!res.ok) {
                        // 请求失败，应用退避策略
                        this._onRequestFailure(res.status);
                        return;
                    }
                    
                    // 请求成功，重置失败计数
                    this._onRequestSuccess();

                    const json = await res.json();

                    data = {
                        images: [],
                        likes: json.like_count || 0,
                        liked: json.current_user_liked || false
                    };

                    const html = json.post_stream?.posts?.[0]?.cooked || '';

                    // 使用 DOM 解析来更精确地过滤图片
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = html;

                    // 移除不需要的内容区域
                    // 1. 移除 onebox（链接预览）中的所有图片
                    tempDiv.querySelectorAll('.onebox, .onebox-body, aside.onebox').forEach(el => el.remove());
                    // 2. 移除 spoiler（遮挡内容）中的所有图片
                    tempDiv.querySelectorAll('.spoiler, .spoiled, .spoiler-blurred, [data-spoiler-state]').forEach(el => el.remove());
                    // 3. 移除引用区域
                    tempDiv.querySelectorAll('.quote, blockquote').forEach(el => el.remove());

                    // 获取剩余的图片
                    const imgs = tempDiv.querySelectorAll('img');
                    imgs.forEach(img => {
                        const src = img.getAttribute('src') || '';
                        // 过滤 emoji、头像、favicon 等非内容图片
                        if (src && !/emoji|avatar|letter_avatar|user_avatar|favicon|icon|logo|badge/i.test(src)) {
                            // 检查图片是否有合理的尺寸属性（排除小图标）
                            const width = parseInt(img.getAttribute('width') || '0');
                            const height = parseInt(img.getAttribute('height') || '0');
                            // 如果有尺寸且太小（小于50px），跳过
                            if ((width > 0 && width < 50) || (height > 0 && height < 50)) {
                                return;
                            }
                            const fullSrc = src.startsWith('/') ? location.origin + src : src;
                            data.images.push(fullSrc);
                            if (data.images.length >= 6) return;
                        }
                    });

                    this.cache.set(tid, data);
                } catch (e) {
                    // 网络错误或超时，应用退避策略
                    if (e.name === 'AbortError') {
                        // 超时，轻微退避
                        this._onRequestFailure(408);
                    } else {
                        // 其他网络错误
                        this._onRequestFailure(0);
                    }
                    return;
                }
            }

            if (data.images.length) {
                const bgEl = card.querySelector('.xhs-card-bg');
                const imgBox = card.querySelector('.xhs-card-img-box');
                const img = card.querySelector('.xhs-card-img');

                if (bgEl && imgBox && img) {
                    // 预加载图片
                    const tempImg = new Image();
                    tempImg.onload = () => {
                        // 使用 RAF 确保平滑过渡
                        requestAnimationFrame(() => {
                            img.src = data.images[0];
                            // 等待图片实际渲染后再切换
                            img.onload = () => {
                                bgEl.style.cssText = 'display:none!important';
                                imgBox.style.cssText = 'display:block';
                                // 双重 RAF 确保渲染完成
                                requestAnimationFrame(() => {
                                    requestAnimationFrame(() => {
                                        img.classList.add('show');
                                    });
                                });
                            };
                        });
                    };
                    tempImg.onerror = () => {
                        // 图片加载失败，保持文字封面
                    };
                    tempImg.src = data.images[0];
                }

                if (data.images.length > 1) {
                    const count = card.querySelector('.xhs-card-count');
                    if (count) {
                        count.innerHTML = `<span>🖼</span><span>${data.images.length}</span>`;
                        count.classList.add('show');
                    }
                }
            }

            // 更新点赞数和状态
            if (data.likes) {
                const likeEl = card.querySelector('.xhs-card-like span:last-child');
                if (likeEl) likeEl.textContent = Utils.formatNumber(data.likes);
            }

            if (data.liked) {
                const likeBtn = card.querySelector('.xhs-card-like');
                const heartEl = card.querySelector('.xhs-heart');
                if (likeBtn && !likeBtn.classList.contains('liked')) {
                    likeBtn.classList.add('liked');
                    if (heartEl) heartEl.textContent = '❤️';
                }
            }
        }
    };

    /* ============================================
     * 应用主模块
     * ============================================ */
    const App = {
        lastUrl: location.href,
        mutationObserver: null,

        init() {
            Styles.injectBase();
            Panel.create();
            Grid.init();
            this.apply();
            this._watch();
            this._watchSystemTheme();
        },

        // 监听系统主题变化
        _watchSystemTheme() {
            const mq = window.matchMedia?.('(prefers-color-scheme: dark)');
            if (mq) {
                mq.addEventListener('change', () => {
                    // 仅在 auto 模式下响应系统变化
                    if (Config.get().darkMode === 'auto' && Config.get().enabled) {
                        Styles.injectTheme();
                        Grid.reset();
                        Grid.render();
                    }
                });
            }
        },

        apply() {
            const config = Config.get();

            // 缓存启用状态供下次早期加载使用
            EarlyStyles.cacheEnabled(config.enabled);

            if (config.enabled) {
                document.body.classList.add('xhs-on');
                Styles.injectTheme();
                Grid.render();
                // 移除早期样式（已被正式样式覆盖）
                EarlyStyles.remove();
            } else {
                document.body.classList.remove('xhs-on', 'xhs-topic');
                Styles.removeTheme();
                Grid.reset();
                EarlyStyles.remove();
            }

            this._updateTopicClass();
        },

        _updateTopicClass() {
            document.body.classList.toggle('xhs-topic', Utils.isTopicPage() && Config.get().enabled);
        },

        _watch() {
            setInterval(() => {
                if (location.href !== this.lastUrl) {
                    this.lastUrl = location.href;
                    Grid.reset();
                    this._updateTopicClass();
                    setTimeout(() => Config.get().enabled && Grid.render(), 300);
                }
            }, 500);

            const debouncedRender = Utils.debounce(() => Grid.render(), 150);
            this.mutationObserver = new MutationObserver((mutations) => {
                const hasNewTopics = mutations.some(m =>
                    m.type === 'childList' &&
                    m.addedNodes.length > 0 &&
                    Array.from(m.addedNodes).some(n =>
                        n.nodeType === 1 && (n.matches?.('tr[data-topic-id]') || n.querySelector?.('tr[data-topic-id]'))
                    )
                );
                if (hasNewTopics && Config.get().enabled) debouncedRender();
            });
            this.mutationObserver.observe(document.body, { childList: true, subtree: true });
        }
    };

    /* ============================================
     * 启动
     * ============================================ */
    const initWhenReady = () => {
        // 确保关键 DOM 元素存在
        if (document.body && document.querySelector('.d-header-icons')) {
            App.init();
        } else {
            // 等待 DOM 完全加载
            requestAnimationFrame(initWhenReady);
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initWhenReady);
    } else if (document.readyState === 'interactive') {
        initWhenReady();
    } else {
        // complete 状态直接初始化
        initWhenReady();
    }

    // 备用：确保初始化完成
    setTimeout(() => {
        if (Config.get().enabled && !Grid.container) {
            Grid.render();
        }
    }, 800);

})();
