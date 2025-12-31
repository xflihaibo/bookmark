# OpenMemory Guide - xflihaibo/bookmark

## Overview
这是一个基于 Vite + React + TypeScript 开发的 Chrome 扩展程序，名为“千面书签”。它提供了智能个人导航、书签管理、快捷链接、企业链接工作台、待办事项和日历提醒等功能。

## Architecture
- **Frontend**: React 18, Tailwind CSS, Lucide Icons (FontAwesome used in components).
- **Extension Logic**: 
    - `manifest.json` (V3): 定义扩展权限和资源。
    - `background.js`: Service Worker，处理书签获取 (`GET_BOOKMARKS`) 等后台逻辑。
- **State Management**: 使用 React Context (`contexts/`) 处理全局状态（主题、书签、企业链接、认证）。
- **Storage**: 主要使用 `localStorage` 缓存用户偏好，`chrome.storage` (在 manifest 中声明) 可能用于跨设备同步（需确认实现）。

## User Defined Namespaces
- frontend: 页面 UI 和 React 组件
- extension: 浏览器扩展特有的后台脚本和 manifest 配置
- database: 本地存储 (localStorage/chrome.storage) 逻辑

## Components
- `Sidebar`: 侧边栏导航，支持模式切换（始终显示/悬停）。
- `Home`: 主页容器，集成搜索、快捷链接、书签网格等。
- `BookmarksGrid`: 书签展示核心组件。
- `TodoPanel`, `CalendarModal`, `SettingsPanel`: 功能模态框/面板。

## Patterns
- **Message Passing**: `Home.tsx` 通过 `chrome.runtime.sendMessage` 与 `background.js` 通信获取书签。
- **Lazy Loading**: 使用 `React.lazy` 异步加载重型组件以优化首屏性能。
- **Error Boundaries**: 关键组件外包裹 `ErrorBoundary` 提高健壮性。
