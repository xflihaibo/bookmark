import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { searchEngines, DEFAULT_SEARCH_ENGINE, SEARCH_STORAGE_KEY } from '@/enum/searchEngines';

export function useSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchEngine, setSearchEngine] = useState(() => {
    const savedEngine = localStorage.getItem(SEARCH_STORAGE_KEY);
    return savedEngine || DEFAULT_SEARCH_ENGINE;
  });
  const [showSearchEngineDropdown, setShowSearchEngineDropdown] = useState(false);

  // 点击外部关闭搜索引擎下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const searchForm = document.querySelector("form[onSubmit=\"handleSearch\"]");

      if (showSearchEngineDropdown && searchForm && !searchForm.contains(event.target as Node)) {
          setShowSearchEngineDropdown(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
        document.removeEventListener("click", handleClickOutside);
    };
  }, [showSearchEngineDropdown]);

  // 处理搜索
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (searchQuery.trim()) {
        const engine = searchEngines.find(eng => eng.label === searchEngine);

        if (engine) {
            window.open(`${engine.url}${encodeURIComponent(searchQuery.trim())}`, "_blank");
        }
    }
  };

  // 当搜索引擎变化时，保存到本地存储
  useEffect(() => {
    localStorage.setItem(SEARCH_STORAGE_KEY, searchEngine);
  }, [searchEngine]);

  // 确保返回searchEngines数组
  return {
    searchQuery,
    setSearchQuery,
    searchEngine,
    setSearchEngine,
    showSearchEngineDropdown,
    setShowSearchEngineDropdown,
    handleSearch,
    searchEngines // 直接返回定义的搜索引擎数组
  };
}