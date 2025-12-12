import { useState, useEffect, useRef } from "react";
import { UI_STORAGE_KEYS } from "@/enum/ui";
import { BookmarkCategory, BookmarksGridProps } from "@/types";
import { useTheme } from "@/hooks/useTheme";

import {transformNestedData} from "@/lib/utils";

export const BookmarksGrid: React.FC<BookmarksGridProps> = ({
    bookmarks,
    activeCategory
}) => {
    const { isDark } = useTheme();
    // todo 添加当前tab 需要过滤的Id[]信息
    // let bookmarkBarCategory=transformNestedData(bookmarks,[])
    // console.log(bookmarks,activeCategory)

    // 状态管理
    const [bookmarkBarCategory,setBookmarkBarCategory]=useState<BookmarkCategory[]>([])
    const [hiddenCategories, setHiddenCategories] = useState<Record<string, string[]>>({});
    const [contextMenuVisible, setContextMenuVisible] = useState(false);
    const [contextMenuPosition, setContextMenuPosition] = useState({ left: 0, top: 0 });
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    

      const getData=(hideCategory?: string[])=>{
        let hideCategoryStage=hideCategory||hiddenCategories[activeCategory] || [];
        let bookmarkBarCategory=transformNestedData(bookmarks,hideCategoryStage)
        setBookmarkBarCategory(bookmarkBarCategory)
    }

    // 菜单引用
    const contextMenuRef = useRef<HTMLDivElement>(null);
    // 每个标题元素的引用
    const categoryTitleRefs = useRef<{[key: string]: HTMLElement | null}>({});

    // 加载本地存储的隐藏设置
    useEffect(() => {
        const savedHiddenCategories = localStorage.getItem(UI_STORAGE_KEYS.HIDDEN_BOOKMARK_CATEGORIES);
        // console.log('activeCategory', savedHiddenCategories)
        if (savedHiddenCategories) {
            try {
                let hiddenCategoriesStage=JSON.parse(savedHiddenCategories)
                setHiddenCategories(hiddenCategoriesStage);
                getData(hiddenCategoriesStage[activeCategory] || [])
            } catch (error) {
                console.error('Failed to load hidden categories from localStorage', error);
            }
        }else{
            setHiddenCategories({});
            getData([]) 
        }

    }, [activeCategory]);

    // 保存隐藏设置到本地存储
    useEffect(() => {
        if (JSON.stringify(hiddenCategories) !== "{}") {
            // console.log('hiddenCategories:',hiddenCategories)
            localStorage.setItem(UI_STORAGE_KEYS.HIDDEN_BOOKMARK_CATEGORIES, JSON.stringify(hiddenCategories));
        }
        // console.log('hiddenCategories:',hiddenCategories)
        // localStorage.setItem(UI_STORAGE_KEYS.HIDDEN_BOOKMARK_CATEGORIES, JSON.stringify(hiddenCategories));


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

    // 监听隐藏分类变更事件（来自管理模态保存），就地刷新数据
    useEffect(() => {
        const handleHiddenCategoriesChanged = () => {
            const saved = localStorage.getItem(UI_STORAGE_KEYS.HIDDEN_BOOKMARK_CATEGORIES);
            const parsed = saved ? JSON.parse(saved) : {};
            setHiddenCategories(parsed);
            getData(parsed[activeCategory] || []);
        };
        window.addEventListener('hiddenBookmarkCategoriesChanged', handleHiddenCategoriesChanged);
        return () => window.removeEventListener('hiddenBookmarkCategoriesChanged', handleHiddenCategoriesChanged);
    }, [activeCategory]);

    // 处理右键菜单显示 - 精确计算菜单位置
    const handleContextMenu = (e: React.MouseEvent, category: string) => {
        e.preventDefault();
        e.stopPropagation();
        // 精确设置菜单位置在标题下方
        setContextMenuPosition({
            left: 20,
            top: 40
        });
        setSelectedCategory(category);
        setContextMenuVisible(true);
    };
    // 隐藏当前分类
    const handleHideCategory = () => {
        if (selectedCategory && activeCategory) {
            let hideCategoryIdS=hiddenCategories[activeCategory as string]||[];
            hideCategoryIdS=[...hideCategoryIdS,selectedCategory]
            setHiddenCategories({
                ...hiddenCategories,
                [activeCategory]: hideCategoryIdS
            })

            getData(hideCategoryIdS)
            // toast(`已在当前标签页下隐藏分类`);
        }
        setContextMenuVisible(false);
    };
    
    // 精确计算并调整菜单位置，确保在标题下方且不超出视口
    useEffect(() => {
        if (contextMenuRef.current && contextMenuVisible && selectedCategory) {
            // 强制重新渲染以获取最新的DOM位置
            requestAnimationFrame(() => {
                const menuElement = contextMenuRef.current;
                if (menuElement ) {                    
                    // 应用最终计算的位置
                    menuElement.style.left = `20px`;
                    menuElement.style.top = `40px`;
                }
            });
        }
    }, [contextMenuVisible, selectedCategory]);

    // 确保所有书签数据正确展示
    if (!bookmarks || bookmarks.length === 0) {
        return null;
    }


    // 渲染书签项
    const renderBookmarkItem = (item:  BookmarkCategory, index: number) => {
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
                href={getValidUrl(item.url as string)}
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
            {bookmarkBarCategory && bookmarkBarCategory.map((category, idx) => {
                return (
                    <div
                        key={idx}
                        className="mb-0 pb-4 border-dashed border-opacity-30 border-gray-400">
                        <div className="relative">
                            <h3
                                ref={el => categoryTitleRefs.current[category.title as string] = el}
                                className={`font-bold text-base mb-2 ${isDark ? "text-white" : "text-gray-800"}`}
                                style={{ fontSize: "14px" }}
                                onContextMenu={(e) => handleContextMenu(e, category.id as string)}>
                                {category.title}
                            </h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {category.children && category.children.map((item, index) => 
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
                    className={`fixed z-50 rounded-xl shadow-xl transition-all duration-200 transform scale-100 opacity-100 ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} border overflow-hidden w-[160px]`}
                    style={{
                        left: `${contextMenuPosition.left}px`,
                        top: `${contextMenuPosition.top}px`
                    }}>
                    <button
                        onClick={handleHideCategory}
                        className={`w-full text-left px-4 py-2 text-sm transition-colors ${isDark ? "text-gray-300 hover:bg-gray-700" : "text-gray-700 hover:bg-gray-100"} flex items-center gap-2`}>
                        <i className="fas fa-eye-slash text-red-500"></i>隐藏书签信息
                    </button>
                </div>
            )}
        </div>
    );
}