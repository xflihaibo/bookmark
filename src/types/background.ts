// 背景图片相关类型定义

/**
 * 背景图片配置接口
 */
export interface BackgroundImageConfig {
  /** 当前背景图片URL */
  url: string | null;
  /** 背景图片类型（预设或自定义） */
  type: 'preset' | 'custom';
  /** 自定义图片的文件名 */
  fileName?: string;
  /** 图片上传时间戳 */
  uploadedAt?: number;
}

/**
 * 背景图片上传结果接口
 */
export interface BackgroundUploadResult {
  /** 上传成功的图片URL */
  url: string;
  /** 图片文件名 */
  fileName: string;
  /** 上传是否成功 */
  success: boolean;
  /** 错误信息（如果上传失败） */
  error?: string;
}

/**
 * 背景图片存储接口
 */
export interface BackgroundStorage {
  /** 存储背景图片配置 */
  saveBackground(background: BackgroundImageConfig): void;
  /** 获取存储的背景图片配置 */
  getBackground(): BackgroundImageConfig | null;
  /** 删除存储的背景图片配置 */
  clearBackground(): void;
}

/**
 * 背景图片设置组件属性接口
 */
export interface BackgroundSettingsProps {
  /** 当前主题是否为暗色 */
  isDark: boolean;
  /** 当前背景图片URL */
  backgroundImage: string | null;
  /** 设置背景图片的回调函数 */
  setBackground: (imageUrl: string) => void;
  /** 重置背景图片的回调函数 */
  resetBackground: () => void;
  /** 处理背景图片上传的回调函数 */
  handleBackgroundUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * 背景图片预览组件属性接口
 */
export interface BackgroundPreviewProps {
  /** 预览的背景图片URL */
  imageUrl: string | null;
  /** 是否显示预览 */
  show: boolean;
  /** 关闭预览的回调函数 */
  onClose: () => void;
}
