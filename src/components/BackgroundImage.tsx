import React, { useState, useEffect } from 'react';
import { BackgroundSettingsProps } from '@/types/background';
import { presetBackgrounds } from '@/enum/backgrounds';

import { UI_STORAGE_KEYS } from '@/enum/ui';

/**
 * 背景图片组件
 * 用于展示和管理背景图片设置
 * 包括预设背景选择、自定义图片上传和背景管理功能
 */
export const BackgroundImage: React.FC<BackgroundSettingsProps> = ({
  backgroundImage,
  setBackground,
  resetBackground,
  handleBackgroundUpload,
  isDark
}) => {
  const [selectedBackground, setSelectedBackground] = useState<string>(backgroundImage || '');
  const [showCustomBackgrounds, setShowCustomBackgrounds] = useState(false);
  const [customBackgrounds, setCustomBackgrounds] = useState<string[]>([]);

  // 加载自定义背景图片
  useEffect(() => {
    const savedCustomBackgrounds = localStorage.getItem(UI_STORAGE_KEYS.CUSTOM_BACKGROUNDS);
    if (savedCustomBackgrounds) {
      try {
        setCustomBackgrounds(JSON.parse(savedCustomBackgrounds));
      } catch (error) {
        console.error('Failed to parse custom backgrounds:', error);
      }
    }
  }, []);

  // 保存自定义背景图片
  const saveCustomBackgrounds = (backgrounds: string[]) => {
    setCustomBackgrounds(backgrounds);
    localStorage.setItem(UI_STORAGE_KEYS.CUSTOM_BACKGROUNDS, JSON.stringify(backgrounds));
  };

  // 处理背景选择
  const handleBackgroundSelect = (imageUrl: string) => {
    setSelectedBackground(imageUrl);
    setBackground(imageUrl);
  };

  // 删除自定义背景
  const handleDeleteCustomBackground = (index: number) => {
    const updated = customBackgrounds.filter((_, i) => i !== index);
    saveCustomBackgrounds(updated);
    
    // 如果删除的是当前选中的背景，重置为默认背景
    if (selectedBackground === customBackgrounds[index]) {
      resetBackground();
      setSelectedBackground('');
    }
  };

  return (
    <div className="background-image-component">
      {/* 背景预览 */}
      <div 
        className={`mb-6 rounded-xl overflow-hidden shadow-lg h-40 relative border ${isDark ? 'border-gray-600' : 'border-gray-200'}`}
        style={{
          backgroundImage: selectedBackground ? `url(${selectedBackground})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {!selectedBackground && (
          <div className={`flex items-center justify-center h-full ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            <i className="fas fa-image text-4xl"></i>
          </div>
        )}
        <div className={`absolute inset-0 bg-gradient-to-t ${isDark ? 'from-black/70 to-transparent' : 'from-black/30 to-transparent'}`}></div>
      </div>

      {/* 背景设置 */}
      <div className="space-y-6">
        {/* 预设背景 */}
        <div>
          <h3 className={`text-sm font-medium mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            预设背景
          </h3>
          <div className="grid grid-cols-5 gap-3">
            {presetBackgrounds.map((imageUrl, index) => (
              <div
                key={index}
                className={`rounded-lg overflow-hidden cursor-pointer transition-all duration-300 transform hover:scale-[1.03] shadow-md relative group ${selectedBackground === imageUrl ? 'ring-2 ring-blue-500 shadow-blue-500/20' : 'ring-2 ring-transparent hover:ring-gray-400/30'}`}
                onClick={() => handleBackgroundSelect(imageUrl)}
                title={`预设背景 ${index + 1}`}
              >
                <img
                  src={imageUrl}
                  alt={`Preset background ${index + 1}`}
                  className="w-full h-20 object-cover transition-transform duration-500 hover:scale-110"
                />
                <div className={`absolute inset-0 ${selectedBackground === imageUrl ? 'bg-blue-500/20' : 'bg-transparent'}`}></div>
              </div>
            ))}
          </div>
        </div>

        {/* 自定义背景 */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              自定义背景
            </h3>
            <button
              onClick={() => setShowCustomBackgrounds(!showCustomBackgrounds)}
              className={`text-xs ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'} transition-colors`}
            >
              {showCustomBackgrounds ? '隐藏' : '显示'}
            </button>
          </div>

          {showCustomBackgrounds && customBackgrounds.length > 0 && (
            <div className="grid grid-cols-5 gap-3 mb-4">
              {customBackgrounds.map((imageUrl, index) => (
                <div
                  key={index}
                  className={`rounded-lg overflow-hidden cursor-pointer transition-all duration-300 transform hover:scale-[1.03] shadow-md relative group ${selectedBackground === imageUrl ? 'ring-2 ring-blue-500 shadow-blue-500/20' : 'ring-2 ring-transparent hover:ring-gray-400/30'}`}
                  onClick={() => handleBackgroundSelect(imageUrl)}
                  title={`自定义背景 ${index + 1}`}
                >
                  <img
                    src={imageUrl}
                    alt={`Custom background ${index + 1}`}
                    className="w-full h-20 object-cover transition-transform duration-500 hover:scale-110"
                  />
                  <div className={`absolute inset-0 ${selectedBackground === imageUrl ? 'bg-blue-500/20' : 'bg-transparent'}`}></div>
                  {/* 删除按钮 */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteCustomBackground(index);
                    }}
                    className={`absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600`}
                    title="删除此背景"
                  >
                    <i className="fas fa-times text-xs"></i>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* 上传自定义背景 */}
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleBackgroundUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <button
              type="button"
              className={`w-full py-3 px-4 rounded-lg border transition-all duration-300 ${isDark ? 'bg-gray-700 hover:bg-gray-600 border-gray-600 text-white' : 'bg-gray-100 hover:bg-gray-200 border-gray-200 text-gray-800'}`}
            >
              <i className="fas fa-upload mr-2"></i>上传本地图片
            </button>
          </div>
        </div>

        {/* 背景管理按钮 */}
        <div className="flex space-x-3">
          <button
            onClick={resetBackground}
            className={`flex-1 py-2.5 px-4 rounded-lg transition-all duration-300 text-sm ${isDark ? 'bg-gray-700 hover:bg-gray-600 border border-gray-600 text-white' : 'bg-gray-100 hover:bg-gray-200 border border-gray-200 text-gray-800'}`}
          >
            <i className="fas fa-redo-alt mr-2"></i>恢复默认背景
          </button>
        </div>
      </div>
    </div>
  );
};
