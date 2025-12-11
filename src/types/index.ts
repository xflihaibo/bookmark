// 基础类型定义
export interface MenuItem {
  id: string;
  icon: string;
  label: string;
  locked?: boolean;
  password?: string;
}

export interface TodoItem {
  id: number;
  text: string;
  completed: boolean;
}

export interface BookmarkCategory {
  category?: string;  // 改回可选，因为实际数据可能使用title
  title?: string;     // 兼容实际数据中的title字段
  links?: any[];      // 使用any[]更灵活地处理实际数据
  children?: BookmarkCategory[];
  // 支持书签项的实际属性
  dateAdded?: number;
  dateLastUsed?: number;
  id?: string;
  index?: number;
  parentId?: string;
  syncing?: boolean;
  url?: string;
}

// 添加缺失的BookmarkItem接口
export interface BookmarkItem {
  title: string;
  url: string;
  id?: string;
}

export interface QuickLink {
  id: number;
  name: string;
  icon?: string;
  color: string;
  url?: string;
}

export interface EnterpriseLink {
  name: string;
  url: string;
  icon?: string;
  description?: string;
  category?: string;
}

export interface BookmarkVisibilitySettings {
  [tabId: string]: string[]; // 每个标签页下隐藏的书签分类列表
}

// 组件Props类型
export interface BookmarkManagementModalProps {
  show: boolean;
  onClose: () => void;
  activeTab: string;
  bookmarks: NestedBookmarkCategory[];
}

// 简化类型定义，BookmarkCategory已经支持嵌套结构，无需额外的NestedBookmarkCategory接口
// 保留NestedBookmarkCategory接口作为别名，以保持向后兼容
export type NestedBookmarkCategory = BookmarkCategory;

export interface MenuModalProps {
  show: boolean;
  onClose: () => void;
  onAdd: (newItem: MenuItem) => void;
  onUpdate: (updatedItem: MenuItem) => void;
  mode: "add" | "edit";
  selectedMenuItem?: MenuItem | null;
}

export interface QuickLinksProps {
  quickLinks: QuickLink[];
  onAddLink: (newLink: QuickLink) => void;
  onUpdateLink: (updatedLink: QuickLink) => void;
  onDeleteLink: (linkId: number) => void;
}

export interface TodoPanelProps {
  show: boolean;
  onClose: () => void;
}

export interface CalendarEvent {
  id: string;
  date: string;
  title: string;
  description: string;
}

export interface CalendarModalProps {
  show: boolean;
  onClose: () => void;
}

export interface ThemeSettingsProps {
  isDark: boolean;
  theme: "light" | "dark";
  toggleTheme: () => void;
  sidebarMode: "always" | "hover";
  setSidebarMode: React.Dispatch<React.SetStateAction<"always" | "hover">>;
  backgroundImage: string | null;
  setBackground: (imageUrl: string) => void;
  resetBackground: () => void;
  handleBackgroundUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleManageQuickLinks: () => void;
  showQuickLinks: boolean;
  toggleShowQuickLinks: () => void;
}

export interface AIBookmarksSettingsProps {
  isDark: boolean;
  isAICategorizing: boolean;
  isChecking404: boolean;
  invalidLinks: string[];
  hiddenBookmarks: string[];
  handleAICategorize: () => void;
  handleCheck404: () => void;
  handleHideBookmark: (link: string) => void;
  handleDeleteBookmark: (link: string) => void;
  handleUnhideBookmark: (bookmark: string) => void;
}

export interface EnterpriseLinksSettingsProps {
  isDark: boolean;
  cdnUrl: string;
  setCdnUrl: React.Dispatch<React.SetStateAction<string>>;
  isSyncing: boolean;
  syncStatus: string;
  enterpriseLinks: {
    name: string;
    url: string;
  }[];
  handleSyncEnterpriseLinks: () => void;
}

export interface SettingsPanelProps {
  show: boolean;
  onClose: () => void;
  backgroundImage: string | null;
  setBackgroundImage: React.Dispatch<React.SetStateAction<string | null>>;
  sidebarMode: "always" | "hover";
  setSidebarMode: React.Dispatch<React.SetStateAction<"always" | "hover">>;
}

export interface LockModalProps {
  isDark: boolean;
  selectedMenuItem: MenuItem | null;
  passwordInput: string;
  confirmPasswordInput: string;
  setPasswordInput: React.Dispatch<React.SetStateAction<string>>;
  setConfirmPasswordInput: React.Dispatch<React.SetStateAction<string>>;
  saveLockPassword: () => void;
  onClose: () => void;
}

export interface UnlockModalProps {
  isDark: boolean;
  selectedMenuItem: MenuItem | null;
  passwordInput: string;
  setPasswordInput: React.Dispatch<React.SetStateAction<string>>;
  verifyUnlockPassword: () => void;
  onClose: () => void;
}

export interface SidebarProps {
  menuItems: MenuItem[];
  bookmark:BookmarkCategory[];
  setMenuItems: React.Dispatch<React.SetStateAction<MenuItem[]>>;
  activeMenuItem: string;
  setActiveMenuItem: React.Dispatch<React.SetStateAction<string>>;
  setShowSettingsPanel: React.Dispatch<React.SetStateAction<boolean>>;
  sidebarMode: "always" | "hover";
}

export interface EnterpriseLinksGridProps {
  enterpriseLinks: EnterpriseLink[];
  isDark: boolean;
}

// 添加缺失的BookmarksGridProps接口
export interface BookmarksGridProps {
  bookmarks: BookmarkCategory[];
  activeCategory: string;
}

// 从组件中提取的额外接口
export interface AuthContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  logout: () => void;
}

export interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setThemeMode: (theme: 'light' | 'dark') => void;
  isDark: boolean;
}

export interface BookmarkContextType {
  bookmarks: BookmarkCategory[];
  hiddenCategories: BookmarkVisibilitySettings;
  setHiddenCategories: React.Dispatch<React.SetStateAction<BookmarkVisibilitySettings>>;
  hideCategory: (tabId: string, category: string) => void;
  showCategory: (tabId: string, category: string) => void;
  isCategoryHidden: (tabId: string, category: string) => boolean;
}

export interface EnterpriseLinkContextType {
  enterpriseLinks: EnterpriseLink[];
  setEnterpriseLinks: React.Dispatch<React.SetStateAction<EnterpriseLink[]>>;
  enterpriseLinkLocked: boolean;
  setEnterpriseLinkLocked: React.Dispatch<React.SetStateAction<boolean>>;
  enterpriseLinkPassword: string;
  setEnterpriseLinkPassword: React.Dispatch<React.SetStateAction<string>>;
  handleDeleteEnterpriseLinks: () => void;
}

// 添加Theme类型定义
export type Theme = 'light' | 'dark';