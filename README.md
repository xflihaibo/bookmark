# 个人导航主页应用

一个现代化的个人导航主页，提供主题切换、企业链接管理、书签分类、快捷链接、待办事项等功能。

## 项目特点

### 🎨 主题切换
- 支持明亮/暗黑模式
- 自动适配系统主题偏好
- 跨标签页主题同步

### 🏢 企业链接
- 集中管理企业内部系统
- 支持密码锁定保护
- 网格布局，一目了然

### 📚 书签管理
- 分类管理个人书签
- 支持隐藏/显示特定分类
- AI智能分类（预留功能）

### ⚡ 快捷链接
- 自定义常用网站入口
- 支持拖拽排序
- 可自定义图标和颜色

### ✅ 待办事项
- 集成待办事项面板
- 支持添加/删除/完成任务
- 本地数据持久化

### 🔍 搜索功能
- 支持多种搜索引擎切换
- 快速搜索入口

### 📅 日历集成
- 显示今日事件提醒

### 🖼️ 背景自定义
- 支持上传自定义背景图片
- 预设背景图片选择

## 技术栈

| 技术/工具 | 版本 |
| --- | --- |
| React | 18.3.1 |
| TypeScript | 5.7.2 |
| Vite | 6.2.0 |
| Tailwind CSS | 3.4.17 |
| React Router | 7.3.0 |
| Framer Motion | 12.9.2 |
| Sonner | 2.0.2 |
| Recharts | 2.15.1 |
| pnpm | - |

## 本地开发

### 环境准备

- Node.js 16+
- pnpm 6+

### 安装依赖

```sh
pnpm install
```

### 启动开发服务器

```sh
pnpm run dev
```

服务器将在 http://localhost:3000 启动

### 构建生产版本

```sh
pnpm run build
```

构建产物将输出到 `dist` 目录

## 项目结构

```
src/
├── components/          # 组件目录
├── contexts/            # React Context 状态管理
├── data/               # 模拟数据
├── enum/               # 枚举定义
├── hooks/              # 自定义 Hooks
├── lib/                # 工具函数
├── pages/              # 页面组件
├── types/              # TypeScript 类型定义
├── App.tsx             # 应用入口组件
├── index.css           # 全局样式
└── main.tsx            # 应用主入口
```

## 核心组件

| 组件 | 功能 |
| --- | --- |
| Sidebar | 侧边栏导航菜单 |
| TodoPanel | 待办事项面板 |
| QuickLinks | 快捷链接组件 |
| BookmarksGrid | 书签网格展示 |
| SettingsPanel | 设置面板 |
| EnterpriseLinksGrid | 企业链接网格 |

## 自定义 Hooks

| Hook | 功能 |
| --- | --- |
| useTheme | 主题管理 |
| useEnterpriseLinks | 企业链接管理 |
| useDateTime | 日期时间处理 |
| useSearch | 搜索功能 |

## 开发规范

- 使用 TypeScript 进行类型安全开发
- 组件命名采用 PascalCase
- Hook 命名以 `use` 开头
- 遵循 ESLint 和 Prettier 代码规范
- 组件职责单一，保持高内聚低耦合

## 未来规划

- [ ] AI 智能书签分类
- [ ] 书签链接有效性检查
- [ ] 导入/导出书签功能
- [ ] 多用户支持
- [ ] 云同步功能
- [ ] 更多自定义主题选项

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License
