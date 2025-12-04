import { useState, useEffect, useCallback } from 'react';

type Theme = 'light' | 'dark';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      return savedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  // 当主题状态变化时，更新DOM和localStorage
  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // 监听其他标签页的localStorage变化，确保跨标签页同步
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'theme' && e.newValue && e.newValue !== theme) {
        setTheme(e.newValue as Theme);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // 清理事件监听器
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [theme]);

  // 切换主题函数 - 使用useCallback确保函数引用稳定
  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      // 立即更新DOM以确保即时视觉反馈
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(newTheme);
      // 更新localStorage
      localStorage.setItem('theme', newTheme);
      // 触发自定义事件，通知应用中所有组件主题已更改
      window.dispatchEvent(new Event('themeChanged'));
      return newTheme;
    });
  }, []);

  // 直接设置主题函数（用于从设置面板中选择主题）
  const setThemeMode = useCallback((newTheme: Theme) => {
    if (newTheme !== theme) {
      setTheme(newTheme);
      // 立即更新DOM
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(newTheme);
      // 更新localStorage
      localStorage.setItem('theme', newTheme);
      // 触发自定义事件
      window.dispatchEvent(new Event('themeChanged'));
    }
  }, [theme]);

  // 监听主题变化事件，确保组件能够响应外部主题更改
  useEffect(() => {
    const handleThemeChanged = () => {
      const savedTheme = localStorage.getItem('theme') as Theme;
      if (savedTheme && savedTheme !== theme) {
        setTheme(savedTheme);
      }
    };

    window.addEventListener('themeChanged', handleThemeChanged);
    
    return () => {
      window.removeEventListener('themeChanged', handleThemeChanged);
    };
  }, [theme]);

  return {
    theme,
    toggleTheme,
    setThemeMode,
    isDark: theme === 'dark'
  };
} 