// 导出所有枚举和常量
export * from './searchEngines';
export * from './menuItems';
export * from './bookmarks';
export * from './quickLinks';
export * from './theme';
export * from './backgrounds';

// 统一的存储键名导出
export const STORAGE_KEYS = {
  // 主题相关
  THEME: 'theme',
  
  // 背景相关
  BACKGROUND_IMAGE: 'backgroundImage',
  
  // 菜单相关
  MENU_ITEMS: 'menuItems',
  SIDEBAR_MODE: 'sidebarMode',
  
  // 搜索相关
  SEARCH_ENGINE: 'searchEngine',
  
  // 快速链接相关
  QUICK_LINKS: 'quickLinks',
  
  // 书签相关
  ...import('./bookmarks').then(module => module.BOOKMARK_STORAGE_KEYS)
};