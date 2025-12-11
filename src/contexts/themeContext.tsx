import { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { UI_STORAGE_KEYS } from '@/enum/ui';
import { ThemeContextType, Theme } from "@/types";

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
  setThemeMode: () => {},
  isDark: false
});

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem(UI_STORAGE_KEYS.THEME) as Theme;
    if (savedTheme) {
      return savedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  // 当主题状态变化时，更新DOM和localStorage
  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    localStorage.setItem(UI_STORAGE_KEYS.THEME, theme);
  }, [theme]);

  // 监听其他标签页的localStorage变化，确保跨标签页同步
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === UI_STORAGE_KEYS.THEME && e.newValue && e.newValue !== theme) {
        setTheme(e.newValue as Theme);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // 清理事件监听器
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [theme]);

  // 切换主题函数
  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  }, []);

  // 直接设置主题函数
  const setThemeMode = useCallback((newTheme: Theme) => {
    if (newTheme !== theme) {
      setTheme(newTheme);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setThemeMode, isDark: theme === 'dark' }}>
      {children}
    </ThemeContext.Provider>
  );
};