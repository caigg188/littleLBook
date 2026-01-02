// ==UserScript==
// @name         LinuxDo 小红书风格
// @namespace    http://tampermonkey.net/
// @version      2.2
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

(function() {
    'use strict';

    /* ============================================
     * 早期样式注入（防止闪烁）
     * ============================================ */
    const EarlyStyles = {
        injected: false,
        styleId: 'xhs-early-styles',

        inject() {
            if (this.injected) return;
            this.injected = true;

            // 尝试从存储读取配置判断是否启用
            let enabled = true;
            try {
                const saved = localStorage.getItem('xhs_enabled_cache');
                if (saved !== null) enabled = saved === 'true';
            } catch {}

            if (!enabled) return;

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
                    background: #f5f5f7 !important;
                }

                /* ===== 预加载卡片核心样式，避免闪烁 ===== */
                /* 文字特效 - 必须早期加载 */
                .xhs-hl {
                    display: inline;
                    padding: 2px 6px;
                    margin: 0 1px;
                    border-radius: 4px;
                    font-weight: 700;
                }
                .xhs-ul {
                    text-decoration: underline;
                    text-decoration-thickness: 2px;
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
                .xhs-card-bg.s1 { background: #FFF5F5; color: #4A2C2C; }
                .xhs-card-bg.s1 .xhs-hl { background: #FED7D7; color: #C53030; }
                .xhs-card-bg.s1 .xhs-ul { text-decoration-color: #FC8181; }
                .xhs-card-bg.s1 .xhs-deco { color: #FEB2B2; }

                .xhs-card-bg.s2 { background: #EBF8FF; color: #2A4365; }
                .xhs-card-bg.s2 .xhs-hl { background: #BEE3F8; color: #2B6CB0; }
                .xhs-card-bg.s2 .xhs-ul { text-decoration-color: #63B3ED; }
                .xhs-card-bg.s2 .xhs-deco { color: #90CDF4; }

                .xhs-card-bg.s3 { background: #F0FFF4; color: #22543D; }
                .xhs-card-bg.s3 .xhs-hl { background: #C6F6D5; color: #276749; }
                .xhs-card-bg.s3 .xhs-ul { text-decoration-color: #68D391; }
                .xhs-card-bg.s3 .xhs-deco { color: #9AE6B4; }

                .xhs-card-bg.s4 { background: #FAF5FF; color: #44337A; }
                .xhs-card-bg.s4 .xhs-hl { background: #E9D8FD; color: #6B46C1; }
                .xhs-card-bg.s4 .xhs-ul { text-decoration-color: #B794F4; }
                .xhs-card-bg.s4 .xhs-deco { color: #D6BCFA; }

                .xhs-card-bg.s5 { background: #FFFAF0; color: #744210; }
                .xhs-card-bg.s5 .xhs-hl { background: #FEEBC8; color: #C05621; }
                .xhs-card-bg.s5 .xhs-ul { text-decoration-color: #F6AD55; }
                .xhs-card-bg.s5 .xhs-deco { color: #FBD38D; }

                .xhs-card-bg.s6 { background: #E6FFFA; color: #234E52; }
                .xhs-card-bg.s6 .xhs-hl { background: #B2F5EA; color: #319795; }
                .xhs-card-bg.s6 .xhs-ul { text-decoration-color: #4FD1C5; }
                .xhs-card-bg.s6 .xhs-deco { color: #81E6D9; }

                .xhs-card-bg.s7 { background: #FFFFF0; color: #5F370E; }
                .xhs-card-bg.s7 .xhs-hl { background: #FAF089; color: #B7791F; }
                .xhs-card-bg.s7 .xhs-ul { text-decoration-color: #ECC94B; }
                .xhs-card-bg.s7 .xhs-deco { color: #F6E05E; }

                .xhs-card-bg.s8 { background: #FFF5F7; color: #521B41; }
                .xhs-card-bg.s8 .xhs-hl { background: #FED7E2; color: #B83280; }
                .xhs-card-bg.s8 .xhs-ul { text-decoration-color: #F687B3; }
                .xhs-card-bg.s8 .xhs-deco { color: #FBB6CE; }

                .xhs-card-bg.s9 { background: #EDFDFD; color: #1D4044; }
                .xhs-card-bg.s9 .xhs-hl { background: #C4F1F9; color: #0987A0; }
                .xhs-card-bg.s9 .xhs-ul { text-decoration-color: #76E4F7; }
                .xhs-card-bg.s9 .xhs-deco { color: #9DECF9; }

                .xhs-card-bg.s10 { background: #FFF8F1; color: #63351D; }
                .xhs-card-bg.s10 .xhs-hl { background: #FFE4CA; color: #C4540A; }
                .xhs-card-bg.s10 .xhs-ul { text-decoration-color: #FF9F5A; }
                .xhs-card-bg.s10 .xhs-deco { color: #FFBD8A; }

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
                    background: #fff;
                    border-radius: 14px;
                    overflow: hidden;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
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
                    overflow: hidden;
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
            } catch {}
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
            showStats: true
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
            return function(...args) {
                clearTimeout(timer);
                timer = setTimeout(() => fn.apply(this, args), delay);
            };
        },

        isTopicPage: () => /\/t\/[^/]+\/\d+/.test(location.pathname),
        isListPage: () => !!document.querySelector('tbody.topic-list-body'),

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
                .xhs-btn:hover { background: rgba(255, 36, 66, 0.1); }
                .xhs-btn svg { width: 20px; height: 20px; transition: fill 0.2s; }
                .xhs-btn.on svg { fill: #ff2442; }
                .xhs-btn.off svg { fill: #999; }
                .xhs-btn.on::after {
                    content: '';
                    position: absolute;
                    bottom: 4px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 5px;
                    height: 5px;
                    background: #ff2442;
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
                    background: linear-gradient(135deg, #ff2442, #ff6b81);
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
                .xhs-switch.on { background: linear-gradient(135deg, #ff2442, #ff6b81); }
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
                .xhs-footer-author { font-size: 11px; color: #999; }
                .xhs-footer-author a { color: #ff2442; text-decoration: none; }
                .xhs-footer-author a:hover { text-decoration: underline; }
                .xhs-reset { font-size: 11px; color: #ff2442; cursor: pointer; padding: 4px 8px; border-radius: 6px; transition: background 0.15s; }
                .xhs-reset:hover { background: rgba(255,36,66,0.1); }
            `);
        },

        injectTheme() {
            this.removeTheme();

            const config = Config.get();
            if (!config.enabled) return;

            const c = config.themeColor;
            const rgb = Utils.hexToRgb(c);
            const lighter = Utils.adjustColor(c, 15);

            const css = `
                :root {
                    --xhs-c: ${c};
                    --xhs-rgb: ${rgb};
                    --xhs-light: rgba(${rgb}, 0.1);
                    --xhs-lighter: ${lighter};
                }

                body.xhs-on { background: #f5f5f7 !important; }

                body.xhs-on .d-header {
                    background: #fff !important;
                    box-shadow: 0 1px 0 var(--xhs-c), 0 2px 12px rgba(0,0,0,0.04) !important;
                    border: none !important;
                }

                body.xhs-on .d-header-icons .btn:hover,
                body.xhs-on .d-header-icons .icon:hover {
                    background: var(--xhs-light) !important;
                }

                body.xhs-on .alert.alert-info.clickable {
                    position: fixed !important;
                    top: 64px !important;
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

                body.xhs-on .sidebar-wrapper { background: #fff !important; }

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

                body.xhs-on .topic-list,
                body.xhs-on .topic-list-header { display: none !important; }

                /* ===== 瀑布流 ===== */
                .xhs-grid {
                    column-count: 4;
                    column-gap: 16px;
                    padding: 16px 0;
                }
                @media (max-width: 1400px) { .xhs-grid { column-count: 4; } }
                @media (max-width: 1200px) { .xhs-grid { column-count: 3; } }
                @media (max-width: 900px) { .xhs-grid { column-count: 2; column-gap: 12px; } }
                @media (max-width: 520px) { .xhs-grid { column-count: 2; column-gap: 10px; } }

                /* ===== 卡片 ===== */
                .xhs-card {
                    break-inside: avoid;
                    background: #fff;
                    border-radius: 14px;
                    overflow: hidden;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
                    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s;
                    margin-bottom: 16px;
                    will-change: transform;
                    contain: layout style paint;
                }
                @media (max-width: 900px) { .xhs-card { margin-bottom: 12px; border-radius: 12px; } }
                @media (max-width: 520px) { .xhs-card { margin-bottom: 10px; border-radius: 10px; } }

                .xhs-card:hover {
                    transform: translateY(-6px);
                    box-shadow: 0 12px 32px rgba(var(--xhs-rgb), 0.12);
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
                    overflow: hidden;
                }
                @media (max-width: 520px) { .xhs-card-excerpt { font-size: 12px; line-height: 1.9; -webkit-line-clamp: 3; } }

                /* 文字效果 */
                .xhs-hl {
                    display: inline;
                    padding: 2px 6px;
                    margin: 0 1px;
                    border-radius: 4px;
                    font-weight: 700;
                }
                .xhs-ul {
                    text-decoration: underline;
                    text-decoration-thickness: 2px;
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

                /* ===== 亮色配色 ===== */
                .xhs-card-bg.s1 { background: #FFF5F5; color: #4A2C2C; }
                .xhs-card-bg.s1 .xhs-hl { background: #FED7D7; color: #C53030; }
                .xhs-card-bg.s1 .xhs-ul { text-decoration-color: #FC8181; }
                .xhs-card-bg.s1 .xhs-deco { color: #FEB2B2; }

                .xhs-card-bg.s2 { background: #EBF8FF; color: #2A4365; }
                .xhs-card-bg.s2 .xhs-hl { background: #BEE3F8; color: #2B6CB0; }
                .xhs-card-bg.s2 .xhs-ul { text-decoration-color: #63B3ED; }
                .xhs-card-bg.s2 .xhs-deco { color: #90CDF4; }

                .xhs-card-bg.s3 { background: #F0FFF4; color: #22543D; }
                .xhs-card-bg.s3 .xhs-hl { background: #C6F6D5; color: #276749; }
                .xhs-card-bg.s3 .xhs-ul { text-decoration-color: #68D391; }
                .xhs-card-bg.s3 .xhs-deco { color: #9AE6B4; }

                .xhs-card-bg.s4 { background: #FAF5FF; color: #44337A; }
                .xhs-card-bg.s4 .xhs-hl { background: #E9D8FD; color: #6B46C1; }
                .xhs-card-bg.s4 .xhs-ul { text-decoration-color: #B794F4; }
                .xhs-card-bg.s4 .xhs-deco { color: #D6BCFA; }

                .xhs-card-bg.s5 { background: #FFFAF0; color: #744210; }
                .xhs-card-bg.s5 .xhs-hl { background: #FEEBC8; color: #C05621; }
                .xhs-card-bg.s5 .xhs-ul { text-decoration-color: #F6AD55; }
                .xhs-card-bg.s5 .xhs-deco { color: #FBD38D; }

                .xhs-card-bg.s6 { background: #E6FFFA; color: #234E52; }
                .xhs-card-bg.s6 .xhs-hl { background: #B2F5EA; color: #319795; }
                .xhs-card-bg.s6 .xhs-ul { text-decoration-color: #4FD1C5; }
                .xhs-card-bg.s6 .xhs-deco { color: #81E6D9; }

                .xhs-card-bg.s7 { background: #FFFFF0; color: #5F370E; }
                .xhs-card-bg.s7 .xhs-hl { background: #FAF089; color: #B7791F; }
                .xhs-card-bg.s7 .xhs-ul { text-decoration-color: #ECC94B; }
                .xhs-card-bg.s7 .xhs-deco { color: #F6E05E; }

                .xhs-card-bg.s8 { background: #FFF5F7; color: #521B41; }
                .xhs-card-bg.s8 .xhs-hl { background: #FED7E2; color: #B83280; }
                .xhs-card-bg.s8 .xhs-ul { text-decoration-color: #F687B3; }
                .xhs-card-bg.s8 .xhs-deco { color: #FBB6CE; }

                .xhs-card-bg.s9 { background: #EDFDFD; color: #1D4044; }
                .xhs-card-bg.s9 .xhs-hl { background: #C4F1F9; color: #0987A0; }
                .xhs-card-bg.s9 .xhs-ul { text-decoration-color: #76E4F7; }
                .xhs-card-bg.s9 .xhs-deco { color: #9DECF9; }

                .xhs-card-bg.s10 { background: #FFF8F1; color: #63351D; }
                .xhs-card-bg.s10 .xhs-hl { background: #FFE4CA; color: #C4540A; }
                .xhs-card-bg.s10 .xhs-ul { text-decoration-color: #FF9F5A; }
                .xhs-card-bg.s10 .xhs-deco { color: #FFBD8A; }

                /* ===== 图片封面 ===== */
                .xhs-card-img-box {
                    position: relative;
                    width: 100%;
                    overflow: hidden;
                    background: #f0f0f0;
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
                    background: linear-gradient(135deg, #f5f5f5, #eee);
                    color: #ccc;
                    font-size: 24px;
                }
                .xhs-card-img.show ~ .xhs-card-img-ph { display: none; }

                .xhs-card-tag {
                    position: absolute;
                    top: 10px;
                    left: 10px;
                    background: rgba(255,255,255,0.95);
                    color: var(--xhs-c);
                    font-size: 10px;
                    font-weight: 600;
                    padding: 4px 10px;
                    border-radius: 10px;
                    z-index: 2;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
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

                .xhs-card-body { padding: 14px; }
                @media (max-width: 520px) { .xhs-card-body { padding: 10px 12px; } }

                .xhs-card-title {
                    display: block;
                    font-size: 14px;
                    font-weight: 600;
                    line-height: 1.45;
                    color: #222;
                    text-decoration: none;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    margin-bottom: 12px;
                    transition: color 0.15s;
                }
                @media (max-width: 520px) { .xhs-card-title { font-size: 13px; margin-bottom: 10px; } }
                .xhs-card-title:hover { color: var(--xhs-c); }

                .xhs-card-meta {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
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
                    color: #666;
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
                    color: #999;
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
                    border-top: 1px solid #f0f0f0;
                    font-size: 11px;
                    color: #999;
                }
                @media (max-width: 520px) { .xhs-card-stats { gap: 10px; margin-top: 10px; padding-top: 10px; font-size: 10px; } }

                /* ===== 帖子详情页 ===== */
                body.xhs-on.xhs-topic { background: #f5f5f7 !important; }

                body.xhs-on.xhs-topic .topic-post {
                    background: #fff !important;
                    border-radius: 20px !important;
                    margin-bottom: 16px !important;
                    box-shadow: 0 2px 12px rgba(0,0,0,0.04) !important;
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
                }
                body.xhs-on.xhs-topic .names .username a:hover { color: var(--xhs-c) !important; }

                body.xhs-on.xhs-topic .cooked {
                    font-size: 15px !important;
                    line-height: 1.8 !important;
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
                <div class="xhs-btn ${Config.get().enabled ? 'on' : 'off'}" title="小红书模式设置">
                    <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
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
                        <span>📕</span>
                        <span>小红书模式</span>
                        <span class="xhs-panel-ver">v2.2</span>
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
                                    <div class="xhs-row-label">启用小红书模式</div>
                                    <div class="xhs-row-desc">瀑布流卡片布局</div>
                                </div>
                            </div>
                            <div class="xhs-switch ${config.enabled ? 'on' : ''}" data-key="enabled"></div>
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
                    <span class="xhs-footer-author">by <a href="https://linux.do/u/jackyliii/summary" target="_blank">JackyLiii</a></span>
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
        concurrency: 6,

        styles: ['s1','s2','s3','s4','s5','s6','s7','s8','s9','s10'],

        cornerDecos: [
            '╭', '╮', '╰', '╯', '┌', '┐', '└', '┘',
            '•', '◦', '○', '◌', '◍', '◎',
            '✧', '✦', '◇', '◆', '△', '▽',
            '✿', '❀', '❁', '✾',
            '✩', '✪', '✫', '☆',
            '♡', '♥',
            '🌿', '☘', '🍃',
        ],

        lineChars: ['·', '•', '◦', '○', '◌', '─', '┄', '┈', '╌', '╍', '∙', '⋅', '⋯'],

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
                            this._queueLoad(card, tid);
                        }
                    }
                });
            }, { rootMargin: '400px 0px', threshold: 0.01 });
        },

        _queueLoad(card, tid) {
            this.loadQueue.push({ card, tid });
            this._processQueue();
        },

        async _processQueue() {
            if (this.isLoading || this.loadQueue.length === 0) return;

            this.isLoading = true;
            const batch = this.loadQueue.splice(0, this.concurrency);
            await Promise.allSettled(batch.map(({ card, tid }) => this._loadImage(card, tid)));
            this.isLoading = false;

            if (this.loadQueue.length > 0) {
                Utils.scheduleIdle(() => this._processQueue());
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
            const segments = text.match(/[\u4e00-\u9fa5]+|[a-zA-Z0-9]+|\s+|[^\u4e00-\u9fa5a-zA-Z0-9\s]+/g) || [text];

            const markable = [];
            segments.forEach((seg, i) => {
                if (seg.trim().length >= 2 && !/^\s+$/.test(seg) && !/^[^\u4e00-\u9fa5a-zA-Z0-9]+$/.test(seg)) {
                    markable.push(i);
                }
            });

            if (markable.length < 2) return Utils.escapeHtml(text);

            const totalMarks = Math.max(1, Math.floor(markable.length * (0.25 + rand() * 0.1)));
            const shuffled = [...markable].sort(() => rand() - 0.5);

            const effects = new Map();
            const types = ['hl', 'ul', 'bd', 'dot'];

            for (let i = 0; i < totalMarks && i < shuffled.length; i++) {
                effects.set(shuffled[i], types[Math.floor(rand() * types.length)]);
            }

            return segments.map((seg, i) => {
                const escaped = Utils.escapeHtml(seg);
                const effect = effects.get(i);
                if (effect) return `<span class="xhs-${effect}">${escaped}</span>`;
                return escaped;
            }).join('');
        },

        _generateDecos(seed) {
            const rand = Utils.seededRandom(seed + '_deco');
            let html = '';

            const corners = ['tl', 'tr', 'bl', 'br'];
            const cornerCount = 1 + Math.floor(rand() * 2);
            const selectedCorners = [...corners].sort(() => rand() - 0.5).slice(0, cornerCount);

            selectedCorners.forEach(pos => {
                const deco = this.cornerDecos[Math.floor(rand() * this.cornerDecos.length)];
                html += `<span class="xhs-deco corner ${pos}">${deco}</span>`;
            });

            if (rand() < 0.3) {
                const lineChar = this.lineChars[Math.floor(rand() * this.lineChars.length)];
                const count = 5 + Math.floor(rand() * 4);
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

            const showStats = Config.get().showStats;
            const rand = Utils.seededRandom(t.tid);

            const sizeClass = rand() > 0.5 ? 'size-tall' : 'size-normal';
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
                try {
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 5000);

                    const res = await fetch(`/t/topic/${tid}.json`, {
                        signal: controller.signal,
                        headers: { 'Accept': 'application/json' },
                        priority: 'low'
                    });

                    clearTimeout(timeoutId);
                    if (!res.ok) return;

                    const json = await res.json();

                    data = {
                        images: [],
                        likes: json.like_count || 0,
                        liked: json.current_user_liked || false
                    };

                    const html = json.post_stream?.posts?.[0]?.cooked || '';
                    const imgRegex = /<img[^>]+src="([^"]+)"[^>]*>/gi;
                    let match;

                    while ((match = imgRegex.exec(html)) !== null) {
                        const src = match[1];
                        if (!/emoji|avatar|letter_avatar|user_avatar|favicon/i.test(src)) {
                            data.images.push(src.startsWith('/') ? location.origin + src : src);
                            if (data.images.length >= 6) break;
                        }
                    }

                    this.cache.set(tid, data);
                } catch {
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
