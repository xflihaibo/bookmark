import { useState, useEffect, useRef } from "react";
import { BookmarkCategory, BookmarksGridProps, BookmarkItem } from "@/types";
import { useTheme } from "@/hooks/useTheme";
import { toast } from "sonner";

// 递归处理嵌套的书签数据结构
const processNestedBookmarks = (items: any[] | undefined): BookmarkItem[] => {
  if (!items || !Array.isArray(items)) return [];
  
  const processedItems: BookmarkItem[] = [];
  
  const processItem = (item: any) => {
    // 如果是嵌套对象且有title字段，则视为书签项
    if (typeof item === 'object' && item && item.title) {
      processedItems.push(item);
      
      // 递归处理子项
      if (item.children && Array.isArray(item.children)) {
        item.children.forEach((child: any) => processItem(child));
      }
    }
  };
  
  items.forEach(item => processItem(item));
  return processedItems;
};

export const BookmarksGrid: React.FC<BookmarksGridProps> = ({
    bookmarks,
    activeCategory
}) => {
    const { isDark } = useTheme();
    
    // 状态管理
    const [hiddenCategories, setHiddenCategories] = useState<Record<string, string[]>>({});
    const [contextMenuVisible, setContextMenuVisible] = useState(false);
    const [contextMenuPosition, setContextMenuPosition] = useState({ left: 0, top: 0 });
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    
    // 菜单引用
    const contextMenuRef = useRef<HTMLDivElement>(null);
    // 每个标题元素的引用
    const categoryTitleRefs = useRef<{[key: string]: HTMLElement | null}>({});

    // 加载本地存储的隐藏设置
    useEffect(() => {
        const savedHiddenCategories = localStorage.getItem('hiddenBookmarkCategories');
        if (savedHiddenCategories) {
            try {
                setHiddenCategories(JSON.parse(savedHiddenCategories));
            } catch (error) {
                console.error('Failed to load hidden categories from localStorage', error);
            }
        }
    }, []);

    // 保存隐藏设置到本地存储
    useEffect(() => {
        localStorage.setItem('hiddenBookmarkCategories', JSON.stringify(hiddenCategories));
    }, [hiddenCategories]);
    
    // 点击外部关闭右键菜单
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (contextMenuRef.current && !contextMenuRef.current.contains(event.target as Node)) {
                setContextMenuVisible(false);
            }
        };
        
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    // 处理嵌套的书签数据，提取有效的标题和URL
    const extractBookmarkItems = (category: BookmarkCategory): BookmarkItem[] => {
        // 检查category是否有title字段(从实际数据看，有些项目使用title而不是category)
        const categoryName = category.category || category.title || '未分类';
        
        // 从children中提取书签项
        if (category.children && Array.isArray(category.children)) {
            return processNestedBookmarks(category.children);
        }
        
        // 如果links存在且是数组，将其转换为标准格式
        if (category.links && Array.isArray(category.links)) {
            return category.links.map((link, index) => ({
                title: typeof link === 'string' ? link : (link.title || '未命名链接'),
                url: typeof link === 'string' ? `#${categoryName}-${index}` : (link.url || '#'),
                id: typeof link === 'string' ? `${categoryName}-${index}` : link.id
            }));
        }
        
        return [];
    };

    // 过滤被隐藏的分类
    const filteredBookmarks = bookmarks.filter(category => {
        // 获取分类名称
        const categoryName = category.category || category.title;
        
        // 基础过滤：排除包含"hide"的分类
        if (categoryName && categoryName.toLowerCase().includes("hide")) {
            return false;
        }
        
        // 检查当前分类是否在当前标签页下被隐藏
        if (activeCategory && hiddenCategories[activeCategory]) {
            return !hiddenCategories[activeCategory].includes(categoryName);
        }
        
        return true;
    });
    
    let displayBookmarks = filteredBookmarks;

    if (activeCategory && activeCategory !== "home") {
        const categoryMap: Record<string, string[]> = {
            "ai": ["千问", "豆包", "DeepSeek", "AI 异常处理"],
            "courses": ["课程", "学习", "教程"],
            "dev": ["GitHub", "Projects", "开发", "工具"],
            "design": ["设计", "UI", "UX", "Figma"],
            "tools": ["工具", "WebTools", "测试"],
            "video": ["视频剪辑", "YouTube"]
        };

        const relatedCategories = categoryMap[activeCategory] || [];

        if (relatedCategories.length > 0) {
            displayBookmarks = filteredBookmarks.filter(
                category => {
                    const categoryName = category.category || category.title;
                    return categoryName && relatedCategories.some(keyword => categoryName.includes(keyword))
                }
            );
        }
    }
    
    // 处理右键菜单显示 - 精确计算菜单位置
    const handleContextMenu = (e: React.MouseEvent, category: string) => {
        e.preventDefault();
        e.stopPropagation();
        
        // 获取标题元素的位置和尺寸
        const targetElement = e.currentTarget as HTMLElement;
        const rect = targetElement.getBoundingClientRect();
        
        // 精确设置菜单位置在标题下方
        setContextMenuPosition({
            left: rect.left,
            top: rect.bottom
        });
        
        setSelectedCategory(category);
        setContextMenuVisible(true);
    };
    
    // 隐藏当前分类
    const handleHideCategory = () => {
        if (selectedCategory && activeCategory) {
            setHiddenCategories(prev => {
                const currentHidden = prev[activeCategory] || [];
                if (!currentHidden.includes(selectedCategory)) {
                    return {
                        ...prev,
                        [activeCategory]: [...currentHidden, selectedCategory]
                    };
                }
                return prev;
            });
            toast(`已在当前标签页下隐藏"${selectedCategory}"分类`);
        }
        setContextMenuVisible(false);
    };
    
    // 精确计算并调整菜单位置，确保在标题下方且不超出视口
    useEffect(() => {
        if (contextMenuRef.current && contextMenuVisible && selectedCategory) {
            // 强制重新渲染以获取最新的DOM位置
            requestAnimationFrame(() => {
                const menuElement = contextMenuRef.current;
                const targetTitle = categoryTitleRefs.current[selectedCategory];
                
                if (menuElement && targetTitle) {
                    const titleRect = targetTitle.getBoundingClientRect();
                    const viewportWidth = window.innerWidth;
                    const viewportHeight = window.innerHeight;
                    
                    // 先计算菜单在标题下方的位置
                    let leftPos = titleRect.left;
                    let topPos = titleRect.bottom;
                    
                    // 获取菜单自身尺寸
                    menuElement.style.left = `${leftPos}px`;
                    menuElement.style.top = `${topPos}px`;
                    const menuRect = menuElement.getBoundingClientRect();
                    
                    // 视口边界检查 - 右侧
                    if (menuRect.right > viewportWidth) {
                        leftPos = Math.max(0, viewportWidth - menuRect.width);
                    }
                    
                    // 视口边界检查 - 底部
                    if (menuRect.bottom > viewportHeight) {
                        topPos = Math.max(0, titleRect.top - menuRect.height);
                    }
                    
                    // 应用最终计算的位置
                    menuElement.style.left = `${leftPos}px`;
                    menuElement.style.top = `${topPos}px`;
                }
            });
        }
    }, [contextMenuVisible, selectedCategory]);

    // 确保所有书签数据正确展示
    if (!bookmarks || bookmarks.length === 0) {
        return (
            <div className={`w-full max-w-[1280px] mx-auto backdrop-blur-lg rounded-2xl p-8 border shadow-xl mt-4 text-center ${isDark ? "bg-white/10 border-white/18 text-gray-300" : "bg-white/70 border-gray-200 text-gray-600"}`}>
                暂无书签数据
            </div>
        );
    }

    // 从实际数据中提取书签栏分类
    const bookmarkBarCategory = displayBookmarks.find(cat => 
        (cat.category === "书签栏" || cat.title === "书签栏")
    );
    
    const otherCategories = displayBookmarks.filter(cat => 
        !(cat.category === "书签栏" || cat.title === "书签栏")
    );

    // 当没有可见书签时，不显示任何内容
    if (displayBookmarks.length === 0) {
        return null;
    }

    // 规范化分类名称
    const getCategoryName = (category: BookmarkCategory): string => {
        return category.category || category.title || '未分类';
    };

    // 渲染书签项
    const renderBookmarkItem = (item: BookmarkItem, index: number) => {
        // 检查URL是否有效，并添加http前缀
        const getValidUrl = (url: string): string => {
            if (!url) return '#';
            if (url.startsWith('http://') || url.startsWith('https://')) {
                return url;
            }
            // 对于没有协议的URL，添加https
            return `https://${url}`;
        };

        return (
            <a
                key={item.id || index}
                href={getValidUrl(item.url)}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex-none w-[calc(12.5%-0.5rem)] py-0.5 px-2 rounded-lg text-left truncate transition-colors duration-300 ${isDark ? "text-gray-300 hover:text-blue-400" : "text-gray-600 hover:text-blue-600"}`}
                title={item.url}
            >
                <span className="cursor-pointer text-sm">{item.title}</span>
            </a>
        );
    };

    return (
        <div
            className={`w-full max-w-[1280px] mx-auto backdrop-blur-lg rounded-2xl p-4 border shadow-xl mt-4 overflow-hidden max-h-[500px] overflow-y-auto min-h-[200px] ${isDark ? "bg-white/10 border-white/18" : "bg-white/70 border-gray-200"}`}>
            {bookmarkBarCategory && (
                <div className="mb-4">
                    <div className="relative">
                        <h3
                            ref={el => categoryTitleRefs.current[getCategoryName(bookmarkBarCategory)] = el}
                            className={`font-bold text-base mb-2 ${isDark ? "text-white" : "text-gray-800"}`}
                            style={{ fontSize: "14px" }}
                            onContextMenu={(e) => handleContextMenu(e, getCategoryName(bookmarkBarCategory))}>
                            {getCategoryName(bookmarkBarCategory)}
                        </h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {extractBookmarkItems(bookmarkBarCategory).map((item, index) => 
                            renderBookmarkItem(item, index)
                        )}
                    </div>
                </div>
            )}

            {otherCategories.map((category, idx) => {
                const categoryName = getCategoryName(category);
                const categoryItems = extractBookmarkItems(category);
                
                // 只显示有书签项的分类
                if (categoryItems.length === 0) return null;
                
                return (
                    <div
                        key={idx}
                        className="mb-0 pb-4 border-dashed border-opacity-30 border-gray-400">
                        <div className="relative">
                            <h3
                                ref={el => categoryTitleRefs.current[categoryName] = el}
                                className={`font-bold text-base mb-2 ${isDark ? "text-white" : "text-gray-800"}`}
                                style={{ fontSize: "14px" }}
                                onContextMenu={(e) => handleContextMenu(e, categoryName)}>
                                {categoryName}
                            </h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {categoryItems.map((item, index) => 
                                renderBookmarkItem(item, index)
                            )}
                        </div>
                    </div>
                );
            })}
            
            {/* 右键菜单 - 精确显示在标题下方 */}
            {contextMenuVisible && selectedCategory && activeCategory && (
                <div
                    ref={contextMenuRef}
                    className={`fixed z-50 rounded-xl shadow-xl transition-all duration-200 transform scale-100 opacity-100 ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} border overflow-hidden w-[180px]`}
                    style={{
                        left: `${contextMenuPosition.left}px`,
                        top: `${contextMenuPosition.top}px`
                    }}>
                    <button
                        onClick={handleHideCategory}
                        className={`w-full text-left px-4 py-2 text-sm transition-colors ${isDark ? "text-gray-300 hover:bg-gray-700" : "text-gray-700 hover:bg-gray-100"} flex items-center gap-2`}>
                        <i className="fas fa-eye-slash text-red-500"></i>在当前标签页下隐藏
                    </button>
                </div>
            )}
        </div>
    );
}