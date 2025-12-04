// 主题相关常量
export type Theme = 'light' | 'dark';

export const ThemeTypes = {
  LIGHT: 'light' as Theme,
  DARK: 'dark' as Theme
} as const;

// 侧边栏模式
export type SidebarMode = 'always' | 'hover';

export const SidebarModes = {
  ALWAYS: 'always' as SidebarMode,
  HOVER: 'hover' as SidebarMode
} as const;

// 主题存储键名
export const THEME_STORAGE_KEY = 'theme';