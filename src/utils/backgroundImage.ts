import { BackgroundUploadResult } from '@/types/background';

/**
 * 处理背景图片上传
 * @param event 文件上传事件
 * @returns 返回包含图片URL的Promise
 */
export const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>): Promise<BackgroundUploadResult> => {
  try {
    const file = event.target.files?.[0];
    if (!file) {
      return {
        url: '',
        fileName: '',
        success: false,
        error: '未选择图片文件'
      };
    }

    // 检查文件类型是否为图片
    if (!file.type.startsWith('image/')) {
      return {
        url: '',
        fileName: '',
        success: false,
        error: '请选择有效的图片文件'
      };
    }

    // 检查文件大小（限制为10MB）
    if (file.size > 10 * 1024 * 1024) {
      return {
        url: '',
        fileName: '',
        success: false,
        error: '图片大小不能超过10MB'
      };
    }

    // 使用FileReader读取图片文件
    const reader = new FileReader();
    
    return new Promise((resolve, reject) => {
      reader.onload = (e) => {
        resolve({
          url: e.target?.result as string,
          fileName: file.name,
          success: true
        });
      };
      
      reader.onerror = () => {
        reject({
          url: '',
          fileName: '',
          success: false,
          error: '图片读取失败'
        });
      };
      
      // 将文件转换为DataURL
      reader.readAsDataURL(file);
    });
  } catch (error) {
    return {
      url: '',
      fileName: '',
      success: false,
      error: error instanceof Error ? error.message : '图片上传处理失败'
    };
  }
};

/**
 * 生成图片的缩略图
 * @param imageUrl 原始图片URL
 * @param width 缩略图宽度
 * @param height 缩略图高度
 * @returns 返回缩略图URL
 */
export const generateThumbnail = async (imageUrl: string, width: number = 200, height: number = 150): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous'; // 允许跨域图片处理
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject('无法创建Canvas上下文');
        return;
      }
      
      // 设置Canvas尺寸
      canvas.width = width;
      canvas.height = height;
      
      // 绘制图片到Canvas，保持比例
      ctx.drawImage(img, 0, 0, width, height);
      
      // 转换为DataURL
      const thumbnailUrl = canvas.toDataURL('image/jpeg', 0.8);
      resolve(thumbnailUrl);
    };
    
    img.onerror = () => {
      reject('图片加载失败');
    };
    
    img.src = imageUrl;
  });
};

/**
 * 验证图片URL是否有效
 * @param imageUrl 图片URL
 * @returns 返回验证结果
 */
export const validateImageUrl = async (imageUrl: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = imageUrl;
  });
};

/**
 * 压缩图片
 * @param file 原始图片文件
 * @param maxWidth 最大宽度
 * @param maxHeight 最大高度
 * @param quality 压缩质量（0-1）
 * @returns 返回压缩后的图片文件
 */
export const compressImage = async (file: File, maxWidth: number = 1920, maxHeight: number = 1080, quality: number = 0.8): Promise<File | null> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      
      img.onload = () => {
        // 计算新尺寸，保持比例
        let width = img.width;
        let height = img.height;
        
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }
        
        // 创建Canvas并绘制压缩后的图片
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(null);
          return;
        }
        
        ctx.drawImage(img, 0, 0, width, height);
        
        // 转换为Blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(null);
              return;
            }
            
            // 创建新的File对象
            const compressedFile = new File([blob], file.name, {
              type: blob.type,
              lastModified: Date.now()
            });
            
            resolve(compressedFile);
          },
          file.type,
          quality
        );
      };
    };
    
    reader.readAsDataURL(file);
  });
};
