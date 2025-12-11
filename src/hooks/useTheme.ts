import { useContext } from 'react';
import { ThemeContext } from '@/contexts/themeContext';

// 统一来源：直接读取 ThemeContext，避免重复的本地状态与副作用
export function useTheme() {
  return useContext(ThemeContext);
}
