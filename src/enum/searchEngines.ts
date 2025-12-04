// 搜索引擎配置
export const searchEngines = [
  {
    label: "谷歌",
    value: "google",
    url: "https://www.google.com/search?q="
  },
  {
    label: "百度",
    value: "baidu",
    url: "https://www.baidu.com/s?wd="
  },
  {
    label: "必应",
    value: "bing",
    url: "https://www.bing.com/search?q="
  },
  {
    label: "搜狗",
    value: "sogou",
    url: "https://www.sogou.com/web?query="
  },
  {
    label: "360搜索",
    value: "so",
    url: "https://www.so.com/s?q="
  }
];

// 搜索相关常量
export const SEARCH_STORAGE_KEY = 'searchEngine';
export const DEFAULT_SEARCH_ENGINE = '谷歌';