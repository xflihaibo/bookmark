import { BackgroundImageConfig } from '@/types/background';

// 存储键名常量
const STORAGE_KEYS = {
  BACKGROUND_IMAGE: 'background_image_config'
};

/**
 * 背景图片存储管理工具
 */
export const backgroundStorage = {
  /**
   * 存储背景图片配置
   * @param background 背景图片配置对象
   */
  saveBackground(background: BackgroundImageConfig): void {
    try {
      const data = JSON.stringify(background);
      localStorage.setItem(STORAGE_KEYS.BACKGROUND_IMAGE, data);
    } catch (error) {
      console.error('保存背景图片配置失败:', error);
    }
  },

  /**
   * 获取存储的背景图片配置
   * @returns 背景图片配置对象，如果没有则返回默认配置
   */
  getBackground(): BackgroundImageConfig {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BACKGROUND_IMAGE);
      if (data) {
        return JSON.parse(data);
      }
    } catch (error) {
      console.error('获取背景图片配置失败:', error);
    }
    
    // 返回默认配置
    return {
      url: null,
      type: 'preset'
    };
  },

  /**
   * 删除存储的背景图片配置
   */
  clearBackground(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.BACKGROUND_IMAGE);
    } catch (error) {
      console.error('清除背景图片配置失败:', error);
    }
  },

  /**
   * 检查本地存储是否可用
   * @returns 本地存储是否可用
   */
  isStorageAvailable(): boolean {
    try {
      const testKey = '__storage_test__';
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
      return true;
    } catch (error) {
      console.error('本地存储不可用:', error);
      return false;
    }
  }
};

/**
 * 通用本地存储工具
 */
export const storage = {
  /**
   * 存储数据
   * @param key 存储键名
   * @param value 存储值
   */
  setItem<T>(key: string, value: T): void {
    try {
      const data = JSON.stringify(value);
      localStorage.setItem(key, data);
    } catch (error) {
      console.error(`存储数据失败 (${key}):`, error);
    }
  },

  /**
   * 获取数据
   * @param key 存储键名
   * @param defaultValue 默认值
   * @returns 存储的值，如果没有则返回默认值
   */
  getItem<T>(key: string, defaultValue: T): T {
    try {
      const data = localStorage.getItem(key);
      if (data) {
        return JSON.parse(data) as T;
      }
    } catch (error) {
      console.error(`获取数据失败 (${key}):`, error);
    }
    return defaultValue;
  },

  /**
   * 删除数据
   * @param key 存储键名
   */
  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`删除数据失败 (${key}):`, error);
    }
  },

  /**
   * 清除所有数据
   */
  clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('清除所有数据失败:', error);
    }
  }
};
