# 千面书签｜使用文档

本文档介绍如何下载与启用扩展、在页面中使用书签过滤（按分类与单条链接）、以及可配置项与本地缓存说明。

---

## 1. 下载与启用

### 1.1 从 Chrome 商店安装（推荐）
上架后：
1. 打开 Chrome 网上应用店，搜索“千面书签”。
2. 点击“添加至 Chrome”。
3. 安装完成后，进入 chrome://extensions，确保扩展已启用，并（可选）固定到工具栏。

### 1.2 本地加载（开发/内测）
1. 在项目根目录执行构建：`npm run build`
2. 打开扩展管理：浏览器地址栏输入 `chrome://extensions`，开启“开发者模式”。
3. 点击“加载已解压的扩展程序”，选择 `dist/static` 目录。
4. 如需替换新标签页，确认 manifest 中已配置：
   ```json
   {
     "chrome_url_overrides": { "newtab": "index.html" }
   }
   ```

### 1.3 首次权限与访问
- 扩展需要权限：
  - `bookmarks`（读取书签树，仅用于本地展示与过滤）
  - `storage`（本地化保存设置）
- 数据不上传、不共享，均存储在本地浏览器。

---

## 2. 启用与基础操作

- 新标签页：安装后默认替换浏览器新标签页（若未生效，请到 chrome://extensions 确认已启用）。
- 主题与背景：右上角设置图标进入“设置面板”，可切换明亮/暗黑、上传或重置背景。
- 侧边栏模式：
  - 常驻（always）：侧边栏一直显示。
  - 悬停（hover）：鼠标靠左侧时显示，离开后隐藏。

---

## 3. 书签过滤

### 3.1 按“分类”过滤（书签树）
1. 在左侧侧边栏，对任意“菜单项”右键，点击“书签显示管理”。
2. 在弹窗中：
   - 勾选 = 显示该分类；取消勾选 = 隐藏该分类。
   - 对父级分类操作会联动全部子分类。
   - “全部显示 / 全部隐藏”可一键操作当前标签页下所有分类。
3. 点击“保存设置”，页面将即时生效（无需刷新）。

说明：
- 该设置对“当前左- 侧菜单项”生效（每个菜单项有独立的隐藏配置）。
- 设置会持久化到本地（见下文“本地缓存键名”）。
- **重要**：除了手动隐藏，任何书签**文件夹**的名称如果包含 `hide` 关键字（不区分大小写），该文件夹及其所有内容将默认被隐藏，且不会出现在“书签显示管理”列表中。

### 3.2 单条链接过滤（隐藏单个书签）
1. 打开“设置面板” → 切换到“AI 书签管理”。
2. 在“404 链接检测”或“已隐藏的书签”区域：
   - 可对单条链接执行“隐藏/删除/恢复显示”操作。

说明：
- 当前版本单条链接管理入口在“设置面板 → AI 书签管理”。
- 该列表会根据你近期操作动态更新。

---

## 4. 快捷链接管理
- 首页中部显示“快捷链接”网格：
  - 点击“+”添加；右键单条链接可“修改/删除”。
  - 在设置面板可整体切换“显示/隐藏快捷链接”。
- 链接打开逻辑：
  - 自动补全协议（如不含 http/https，会默认以 https 打开）。

---

## 5. 企业链接工作台

企业链接功能允许你通过一个外部的 JSON 文件，批量导入公司或团队的常用链接，并在侧边栏生成一个专属的“公文包”图标入口。

### 5.1 使用方法
1.  **同步链接**：
    *   打开“设置”面板（右上角齿轮图标）。
    *   切换到“企业链接”页签。
    *   在输入框中填入你的 CDN 地址（一个可公开访问的 JSON 文件 URL）。
    *   点击“同步”。成功后，侧边栏会出现“公文包”图标。
2.  **访问与管理**：
    *   点击侧边栏的“公文包”图标，即可查看所有企业链接。
    *   右键点击“公文包”图标，可以对整个企业链接模块进行“锁定/解锁/删除”操作。

### 5.2 CDN 配置与 JSON 格式说明

CDN 地址必须是一个返回有效 JSON 数据的 URL。扩展支持以下几种常见的 JSON 格式，会自动解析：

#### 格式一：`companyArr` (推荐，支持分类)

这种格式允许你对链接进行分组。

-   **`companyArr`**: 一个数组，每个元素代表一个链接分类。
    -   `title`: `string` - 分类的标题。
    -   `children`: 一个数组，包含该分类下的所有链接。
        -   `title`: `string` - 链接的名称。
        -   `url`: `string` - 链接的地址。
-   **`companyImg`**: `string` (可选) - 公司的 Logo 或背景图 URL。如果提供，在选中“企业链接”时，将作为页面背景。

**示例：**
```json
{
  "companyArr": [
    {
      "title": "研发工具",
      "children": [
        { "title": "GitLab", "url": "https://gitlab.company.com" },
        { "title": "Jira", "url": "https://jira.company.com" }
      ]
    },
    {
      "title": "内部系统",
      "children": [
        { "title": "OA 系统", "url": "https://oa.company.com" },
        { "title": "HR 系统", "url": "https://hr.company.com" }
      ]
    }
  ],
  "companyImg": "https://example.com/company-background.png"
}
```

#### 格式二：`links` 数组 (扁平结构)

一个包含链接对象的扁平数组。

-   **`links`**: 一个数组，每个元素是一个链接对象。
    -   `name` 或 `title`: `string` - 链接名称。
    -   `url` 或 `link`: `string` - 链接地址。
    -   `icon`: `string` (可选) - Font Awesome 图标类名。
    -   `description`: `string` (可选) - 链接描述。

**示例：**
```json
{
  "links": [
    {
      "name": "企业门户",
      "url": "https://portal.company.com",
      "icon": "fa-building",
      "description": "公司官方门户"
    },
    {
      "title": "内部文档",
      "link": "https://docs.company.com",
      "icon": "fa-file-alt"
    }
  ]
}
```

#### 格式三：根级数组 (最简扁平结构)

直接一个链接对象数组。

-   `name` 或 `title`: `string` - 链接名称。
-   `url` 或 `link`: `string` - 链接地址。
-   `icon`: `string` (可选) - Font Awesome 图标类名。
-   `description`: `string` (可选) - 链接描述。

**示例：**
```json
[
  {
    "name": "项目管理",
    "url": "https://projects.company.com"
  },
  {
    "name": "团队协作",
    "url": "https://team.company.com"
  }
]
```

---

## 6. 可配置项与本地缓存

以下为主要设置项及其本地缓存键名（localStorage）：
- 主题/暗黑：`theme`
- 背景图片：`backgroundImage`
- 侧边栏模式：`sidebarMode`（always/hover）
- 当前激活菜单：`activeMenuItem`
- 菜单项配置：`menuItems`
- 快捷链接列表：`quickLinks`
- 快捷链接显示：`showQuickLinks`
- 书签隐藏分类：`hiddenBookmarkCategories`（按菜单项分别记录）
- 企业链接：
  - 是否存在：`has_enterprise_links`
  - 列表数据：`enterprise_links`
  - 锁定状态：`enterprise_link_locked`
  - 密码：`enterprise_link_password`
  - 同步 CDN 地址：`enterpriseCdnUrl`
  - 公司图片（如返回）：`companyImage`

重置方法：
- 通过浏览器“清除站点数据”或在控制台手动移除上述键名，将恢复默认。

---

## 7. 故障排查
- 新标签页未生效：
  - 检查扩展是否启用；如为本地加载，确认 `dist/static` 根目录中包含 `manifest.json`。
- 书签未显示 / 无权限：
  - 在 chrome://extensions 找到本扩展 → 详情 → 权限中允许访问书签。
- 字体/图标不显示：
  - 若使用 npm 引入 Font Awesome，确保依赖安装成功并已在入口（main.tsx）导入。
- 反复渲染或闪动：
  - 开发模式下 React StrictMode 会触发双渲染；生产构建后不会出现。

---

## 8. 常见操作速查
- 切换主题：右上角设置 → 主题模式开关
- 切换侧边栏模式：右上角设置 → 侧边栏设置（常驻/悬停）
- 切换快捷链接显示：右上角设置 → 快捷链接显示开关
- 书签分类隐藏/显示：左侧某菜单项右键 → 书签显示管理 → 勾选/取消
- 单条书签隐藏/恢复：设置 → AI 书签管理
- 企业链接：设置 → 企业链接 → 填写 CDN → 同步；侧边栏右键进行锁定/解锁/删除

---

如需补充“隐私政策/商店文案/打包与上架指南”，请参见：
- docs/chrome-store-listing.md（商店文案）
- 可由我继续生成隐私政策模板与 manifest/background 示例文件。

