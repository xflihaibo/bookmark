import React, { useState, useEffect, useMemo } from "react";
import { NestedBookmarkCategory, BookmarkManagementModalProps } from "@/types";
import { useTheme } from "@/hooks/useTheme";
import { toast } from "sonner";
import { UI_STORAGE_KEYS } from "@/enum/ui";

export const BookmarkManagementModal: React.FC<BookmarkManagementModalProps> = (
    { bookmarks, show, onClose, activeTab }
) => {
    const {isDark } = useTheme();
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

    // 计算可管理的分类（有 children 且标题不包含 hide）对应的 ID 列表
    const selectableCategoryIds = useMemo(() => {
        const ids: string[] = [];
        const walk = (nodes: NestedBookmarkCategory[]) => {
            nodes.forEach(node => {
                const title = (node.title || "").toLowerCase();
                const isCategory = Array.isArray(node.children) && node.children.length > 0;
                if (isCategory && !title.includes("hide")) {
                    ids.push(node.id as string);
                    walk(node.children!);
                }
            });
        };
        walk(bookmarks);
        return ids;
    }, [bookmarks]);

    const totalCount = selectableCategoryIds.length;

    // 初始化选择的分类
    useEffect(() => {
        if (show) {
            const savedHiddenCategories = localStorage.getItem(UI_STORAGE_KEYS.HIDDEN_BOOKMARK_CATEGORIES);
            const hiddenCategories = savedHiddenCategories ? JSON.parse(savedHiddenCategories) : {};
            const hideCategories = hiddenCategories[activeTab] || [];
            setSelectedCategories(hideCategories);
        }
    }, [show, activeTab]);

    // 递归获取某个分类下所有子分类ID（用于勾选/取消时同步子级）
    const getAllChildCategoryIds = (categories: NestedBookmarkCategory[], parentId: string): string[] => {
        let childIds: string[] = [];
        const findChildren = (items: NestedBookmarkCategory[]) => {
            for (const item of items) {
                if (item.children && item.children.length > 0) {
                    const catId = item.id as string;
                    childIds.push(catId);
                        findChildren(item.children);
                }
            }
        };
        const findCurrentCategory = (items: NestedBookmarkCategory[]) => {
            for (const item of items) {
                const catId = item.id as string;
                if (catId === parentId && item.children) {
                    findChildren(item.children);
                    break;
                }
                if (item.children) {
                    findCurrentCategory(item.children);
                }
            }
        };
        findCurrentCategory(bookmarks);
        return childIds;
    };

    // 处理分类选择变化（含子分类）
    const handleCategoryChange = (categoryId: string) => {
        const childCategoryIds = getAllChildCategoryIds(bookmarks, categoryId);
        if (selectedCategories.includes(categoryId)) {
            // 当前处于隐藏 → 设为显示，同时显示全部子分类
            setSelectedCategories(prev => prev.filter(id => id !== categoryId && !childCategoryIds.includes(id)));
        } else {
            // 当前处于显示 → 设为隐藏，同时隐藏全部子分类
            setSelectedCategories(prev => [...prev, categoryId, ...childCategoryIds].filter((id, idx, self) => self.indexOf(id) === idx));
        }
    };

    // 展开/收起分类
    const toggleCategoryExpansion = (category: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const next = new Set(expandedCategories);
        next.has(category) ? next.delete(category) : next.add(category);
        setExpandedCategories(next);
    };

    // 全部显示 / 全部隐藏
    const showAll = () => setSelectedCategories([]);
    const hideAll = () => setSelectedCategories(selectableCategoryIds);

    const handleSave = () => {
        const savedHiddenCategories = localStorage.getItem(UI_STORAGE_KEYS.HIDDEN_BOOKMARK_CATEGORIES);
            const hiddenCategories = savedHiddenCategories ? JSON.parse(savedHiddenCategories) : {};
            hiddenCategories[activeTab] = selectedCategories;
        localStorage.setItem(UI_STORAGE_KEYS.HIDDEN_BOOKMARK_CATEGORIES, JSON.stringify(hiddenCategories));
        toast.success(`设置已保存：显示 ${Math.max(totalCount - selectedCategories.length, 0)} / 共 ${totalCount}`);
        window.dispatchEvent(new Event("hiddenBookmarkCategoriesChanged"));
            onClose();
        };

        // 树状结构
        const renderCategory = (category: NestedBookmarkCategory, level: number = 0) => {
            const catName = category.title as string;
            const hasChildren = category.children && category.children.some(item => item.children);
            const isExpanded = expandedCategories.has(catName);
            const indent = level * 24;
        if (category.children && !catName.toLowerCase().includes('hide')) {
            return (
                <React.Fragment key={catName}>
                <div
                    className={`flex items-center justify-between rounded-lg px-4 py-3.5 transition-all duration-300 ease-in-out mb-1.5
                            ${isDark ? "bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/20" : "bg-gray-50 hover:bg-gray-100 border border-transparent hover:border-gray-200"}
                            ${hasChildren ? "font-medium" : ""}`}
                        style={{ paddingLeft: `${indent + 16}px`, padding: "4px 8px 4px 16px" }}
                    >
                    <div className="flex items-center gap-3 flex-1">
                            {hasChildren && (
                                <button
                            onClick={e => toggleCategoryExpansion(catName, e)}
                            className={`text-xs w-4 h-4 flex items-center justify-center rounded-full transition-all duration-300 
                                        ${isDark ? "text-gray-400 hover:text-white hover:bg-white/10" : "text-gray-500 hover:text-gray-800 hover:bg-gray-200"}`}
                                    style={{ marginLeft: `-8px` }}
                            >
                                    <i className={`fas transition-transform duration-300 ${isExpanded ? "fa-chevron-down" : "fa-chevron-right"}`}></i>
                                </button>
                            )}
                        <input
                            type="checkbox"
                            id={`category-${catName}`}
                            checked={!selectedCategories.includes(category.id as string)}
                            onChange={() => handleCategoryChange(category.id as string)}
                                className="accent-blue-500 h-4 w-4 cursor-pointer transition-transform duration-200 hover:scale-110"
                            />
                            <label htmlFor={`category-${catName}`} className={`${isDark ? "text-white" : "text-gray-800"} flex-1 text-xs cursor-pointer`}>
                            {catName}
                        </label>
                    </div>
                </div>
                    {hasChildren && isExpanded && (
                        <div className="ml-5 animate-fadeIn">
                    {category.children.map(child => renderCategory(child, level + 1))}
                        </div>
                    )}
            </React.Fragment>
        );
        }  
        return null;
    };

    if (!show) return null;

    const visibleCount = Math.max(totalCount - selectedCategories.length, 0);

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm transition-opacity duration-300" onClick={onClose}>
            <div
                className={`w-full max-w-2xl backdrop-blur-lg rounded-2xl border shadow-xl transform transition-all duration-300 flex flex-col ${isDark ? "bg-white/10 border-white/18" : "bg-white/70 border-gray-200"}`}
                onClick={e => e.stopPropagation()}
                style={{ maxHeight: "80vh", padding: "16px" }}
            >
                <div className="flex justify-between items-center mb-4">
                    <h3 className={`font-bold text-xl ${isDark ? "text-white" : "text-gray-800"} flex items-center gap-2`}>
                        <i className="fas fa-bookmark"></i>书签显示管理
                                            </h3>
                    <button
                        onClick={onClose}
                        className={`text-xl p-1 rounded-full transition-colors ${isDark ? "text-gray-300 hover:text-white hover:bg-white/10" : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"}`}
                        aria-label="关闭"
                    >
                        <i className="fas fa-times"></i>
                    </button>
                </div>

                <p className={`mb-2 text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                    说明：勾选 = 显示；未勾选 = 隐藏。仅作用于当前标签页（{activeTab === 'home' ? '首页' : activeTab}）。
                                    </p>

                <div className={`flex items-center justify-between mb-3 p-2 rounded-lg ${isDark ? "bg-white/5" : "bg-gray-50"}`}>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={showAll}
                            className={`text-xs py-1 px-3 rounded ${isDark ? "bg-blue-900/40 text-blue-300 hover:bg-blue-900/60" : "bg-blue-100 text-blue-700 hover:bg-blue-200"}`}
                            title="将所有分类设置为显示"
                        >
                            全部显示
                        </button>
                        <button
                            type="button"
                            onClick={hideAll}
                            className={`text-xs py-1 px-3 rounded ${isDark ? "bg-gray-700 text-gray-200 hover:bg-gray-600" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
                            title="将所有分类设置为隐藏"
                        >
                            全部隐藏
                        </button>
                    </div>
                    <div className={`text-xs ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                        显示：{visibleCount} / 共：{totalCount}（已隐藏：{selectedCategories.length}）
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto pr-2 space-y-2 mb-4">
                    {bookmarks.map(category => renderCategory(category))}
                </div>

                <div className="flex justify-end gap-3 p-0 pt-2 mt-0 border-t border-opacity-20 border-gray-400">
                    <button
                        onClick={onClose}
                        className={`py-2.5 px-6 rounded-lg transition-colors ${isDark ? "bg-white/10 hover:bg-white/20 text-white border border-white/10" : "bg-white/80 hover:bg-white text-gray-800 border border-gray-200"} border`}
                    >
                        取消
                                            </button>
                    <button
                        onClick={handleSave}
                        className={`py-2.5 px-6 rounded-lg transition-colors ${isDark ? "bg-blue-600 hover:bg-blue-500 text-white" : "bg-blue-500 hover:bg-blue-600 text-white"}`}
                    >
                        保存设置
                                            </button>
                </div>
            </div>
        </div>
    );
};
