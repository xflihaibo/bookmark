// 菜单栏相关常量
export const initialMenuItems = [
  { id: 'home', icon: 'fa-house', label: '首页' },
  { id: 'ai', icon: 'fa-robot', label: 'AI' },
  { id: 'work', icon: 'fa-computer', label: '工作' },
  { id: 'learning', icon: 'fa-graduation-cap', label: '学习' },
  { id: 'entertainment', icon: 'fa-gamepad', label: '娱乐' }
];

export const availableIcons = [
        "fa-robot",
        "fa-brain",
        "fa-microchip",
        "fa-atom",
        "fa-code",
        "fa-database",
        "fa-network-wired",
        "fa-server",
        "fa-plug",
        "fa-sitemap",
        "fa-gear",
        "fa-lightbulb",
        "fa-puzzle-piece",
        "fa-magic",
        "fa-calculator",
        "fa-cube",
        "fa-laptop-code",
        "fa-diagram-project",
        "fa-share-from-square",
        "fa-arrows-rotate",
        "fa-cubes",
        "fa-random",
        "fa-percent",
        "fa-graduation-cap",
        "fa-chart-line",
        "fa-computer",
        "fa-clipboard-check",
        "fa-terminal",
        "fa-memory",
        "fa-cog",
        "fa-microscope",
        "fa-laptop",
        "fa-tablet",
        "fa-mobile-screen",
        "fa-gauge-high",
        "fa-rocket",
        "fa-wifi",
        "fa-ethernet",
        "fa-satellite",
        "fa-cloud",
        "fa-cloud-arrow-up",
        "fa-arrow-trend-up",
        "fa-chart-bar",
        "fa-chart-pie",
        "fa-house",
        "fa-briefcase",
        "fa-gamepad",
        "fa-heart-pulse",
        "fa-music",
        "fa-images",
        "fa-bolt",
        "fa-shopping-cart",
        "fa-thumbs-up",
        "fa-star",
        "fa-flag",
        "fa-heart",
        "fa-wallet",
        "fa-tools",
        "fa-plane",
        "fa-th",
        "fa-envelope",
        "fa-comment",
        "fa-video",
        "fa-calendar",
        "fa-clock",
        "fa-piggy-bank",
        "fa-user",
        "fa-chess"
];

export const MenuMode = {
  ADD: 'add',
  EDIT: 'edit'
} as const;

export type MenuModeType = typeof MenuMode[keyof typeof MenuMode];

// 菜单存储键名
export const MENU_STORAGE_KEY = 'menuItems';
export const SIDEBAR_MODE_STORAGE_KEY = 'sidebarMode';
export const DEFAULT_SIDEBAR_MODE = 'always';