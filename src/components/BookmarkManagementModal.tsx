import React, { useState, useEffect } from "react";
import { BookmarkCategory, NestedBookmarkCategory, BookmarkManagementModalProps } from "@/types";
import { useTheme } from "@/hooks/useTheme";
import { toast } from "sonner";
import { bookmarksData } from "@/data";

export const BookmarkManagementModal: React.FC<BookmarkManagementModalProps> = (
    {
        show,
        onClose,
        activeTab
    }
) => {
    const {
        isDark
    } = useTheme();

    const [selectedCategories, setSelectedCategories] = useState<Record<string, boolean>>({});
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
    // 安全地过滤包含"hide"的书签分类，先检查category属性是否存在
    const filteredBookmarks = bookmarksData.filter(category => 
      category.category && !category.category.toLowerCase().includes("hide")
    );

    const getNestedBookmarks = (): NestedBookmarkCategory[] => {
        const nestedData: NestedBookmarkCategory[] = [];

        const mainCategories: Record<string, NestedBookmarkCategory> = {
            "AI工具": {
                category: "AI工具",
                links: [],
                children: []
            },

            "开发资源": {
                category: "开发资源",
                links: [],
                children: []
            },

            "生活服务": {
                category: "生活服务",
                links: [],
                children: []
            },

            "学习资料": {
                category: "学习资料",
                links: [],
                children: []
            }
        };

        filteredBookmarks.forEach(category => {
            if (["千问", "豆包", "DeepSeek", "AI 异常处理"].includes(category.category)) {
                if (mainCategories["AI工具"].children) {
                    mainCategories["AI工具"].children.push({
                        ...category
                    });
                }
            } else if (["GitHub", "前端开发", "后端开发", "开发工具"].includes(category.category)) {
                if (mainCategories["开发资源"].children) {
                    mainCategories["开发资源"].children.push({
                        ...category
                    });
                }
            } else if (["设计资源", "生活服务"].includes(category.category)) {
                if (mainCategories["生活服务"].children) {
                    mainCategories["生活服务"].children.push({
                        ...category
                    });
                }
            } else if (["学习资源"].includes(category.category)) {
                if (mainCategories["学习资料"].children) {
                    mainCategories["学习资料"].children.push({
                        ...category
                    });
                }
            } else {
                nestedData.push({
                    ...category
                });
            }
        });

        Object.values(mainCategories).forEach(cat => {
            if (cat.children && cat.children.length > 0) {
                nestedData.push(cat);
            }
        });

        return nestedData;
    };

    const nestedBookmarks = getNestedBookmarks();

    useEffect(() => {
        if (show) {
            const savedHiddenCategories = localStorage.getItem("hiddenBookmarkCategories");

            if (savedHiddenCategories) {
                try {
                    const hidden = JSON.parse(savedHiddenCategories);
                    const activeHidden = hidden[activeTab] || [];
                    const initialSelected: Record<string, boolean> = {};

                    const processCategories = (categories: NestedBookmarkCategory[]) => {
                        categories.forEach(category => {
                            initialSelected[category.category] = !activeHidden.includes(category.category);

                            if (category.children && category.children.length > 0) {
                                processCategories(category.children);
                            }
                        });
                    };

                    processCategories(nestedBookmarks);
                    setSelectedCategories(initialSelected);
                    const expanded = new Set<string>();

                    nestedBookmarks.forEach(category => {
                        if (category.children && category.children.length > 0) {
                            expanded.add(category.category);
                        }
                    });

                    setExpandedCategories(expanded);
                } catch (error) {
                    console.error("Failed to load hidden categories from localStorage", error);
                    const initialSelected: Record<string, boolean> = {};

                    const processCategories = (categories: NestedBookmarkCategory[]) => {
                        categories.forEach(category => {
                            initialSelected[category.category] = true;

                            if (category.children && category.children.length > 0) {
                                processCategories(category.children);
                            }
                        });
                    };

                    processCategories(nestedBookmarks);
                    setSelectedCategories(initialSelected);
                }
            } else {
                const initialSelected: Record<string, boolean> = {};

                const processCategories = (categories: NestedBookmarkCategory[]) => {
                    categories.forEach(category => {
                        initialSelected[category.category] = true;

                        if (category.children && category.children.length > 0) {
                            processCategories(category.children);
                        }
                    });
                };

                processCategories(nestedBookmarks);
                setSelectedCategories(initialSelected);
            }
        }
    }, [show, activeTab]);

    const handleCategoryChange = (category: string) => {
        setSelectedCategories(prev => ({
            ...prev,
            [category]: !prev[category]
        }));
    };

    const toggleCategoryExpansion = (category: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const newExpanded = new Set(expandedCategories);

        if (newExpanded.has(category)) {
            newExpanded.delete(category);
        } else {
            newExpanded.add(category);
        }

        setExpandedCategories(newExpanded);
    };

    const handleSelectAll = (selectAll: boolean) => {
        const updatedSelection: Record<string, boolean> = {};

        const processCategories = (categories: NestedBookmarkCategory[]) => {
            categories.forEach(category => {
                updatedSelection[category.category] = selectAll;

                if (category.children && category.children.length > 0) {
                    processCategories(category.children);
                }
            });
        };

        processCategories(nestedBookmarks);
        setSelectedCategories(updatedSelection);
    };

    const handleSave = () => {
        const categoriesToHide: string[] = [];

        const processCategories = (categories: NestedBookmarkCategory[]) => {
            categories.forEach(category => {
                if (!selectedCategories[category.category]) {
                    categoriesToHide.push(category.category);
                }

                if (category.children && category.children.length > 0) {
                    processCategories(category.children);
                }
            });
        };

        processCategories(nestedBookmarks);
        const savedHiddenCategories = localStorage.getItem("hiddenBookmarkCategories");
        const hiddenCategories = savedHiddenCategories ? JSON.parse(savedHiddenCategories) : {};
        hiddenCategories[activeTab] = categoriesToHide;
        localStorage.setItem("hiddenBookmarkCategories", JSON.stringify(hiddenCategories));
        toast("书签显示设置已保存");
        onClose();
        window.location.reload();
    };

    const renderCategory = (category: NestedBookmarkCategory, level: number = 0) => {
        const hasChildren = category.children && category.children.length > 0;
        const isExpanded = expandedCategories.has(category.category);
        const indent = level * 24;

        const calculateTotalLinks = (cat: NestedBookmarkCategory): number => {
            let total = cat.links.length;

            if (cat.children && cat.children.length > 0) {
                total += cat.children.reduce((sum, child) => sum + calculateTotalLinks(child), 0);
            }

            return total;
        };

        const totalLinks = calculateTotalLinks(category);

        return (
            <React.Fragment key={category.category}>
                <div
                    className={`flex items-center justify-between rounded-lg px-4 py-3.5 transition-all duration-300 ease-in-out mb-1.5
                            ${isDark ? "bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/20" : "bg-gray-50 hover:bg-gray-100 border border-transparent hover:border-gray-200"}
                            ${hasChildren ? "font-medium" : ""}`}
                    style={{
                        paddingLeft: `${indent + 16}px`,
                        padding: "8px 8px 8px 16px"
                    }}>
                    <div className="flex items-center gap-3 flex-1">
                        {hasChildren && <button
                            onClick={e => toggleCategoryExpansion(category.category, e)}
                            className={`text-xs w-7 h-7 flex items-center justify-center rounded-full transition-all duration-300 
                                        ${isDark ? "text-gray-400 hover:text-white hover:bg-white/10" : "text-gray-500 hover:text-gray-800 hover:bg-gray-200"}`}
                            style={{
                                marginLeft: `-${indent + 16}px`
                            }}>
                            <i
                                className={`fas transition-transform duration-300 ${isExpanded ? "fa-chevron-down" : "fa-chevron-right"}`}></i>
                        </button>}
                        <input
                            type="checkbox"
                            id={`category-${category.category}`}
                            checked={selectedCategories[category.category] || false}
                            onChange={() => handleCategoryChange(category.category)}
                            className="accent-blue-500 h-5 w-5 cursor-pointer transition-transform duration-200 hover:scale-110" />
                        <label
                            htmlFor={`category-${category.category}`}
                            className={`${isDark ? "text-white" : "text-gray-800"} flex-1 cursor-pointer`}>
                            {category.category}
                        </label>
                    </div>
                    <span
                        className={`text-sm px-3.5 py-1.5 rounded-full font-medium transition-all duration-300
                                ${isDark ? "bg-white/10 text-gray-300 hover:bg-white/20" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                        {hasChildren ? `${totalLinks}个链接 (含子分类)` : `${totalLinks}个链接`}
                    </span>
                </div>
                {hasChildren && isExpanded && <div className="ml-5 animate-fadeIn">
                    {category.children.map(child => renderCategory(child, level + 1))}
                </div>}
            </React.Fragment>
        );
    };

    if (!show)
        return null;

    return (
        <div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm transition-opacity duration-300"
            onClick={onClose}>
            <div
                className={`w-full max-w-2xl backdrop-blur-lg rounded-2xl border shadow-xl transform transition-all duration-300 flex flex-col ${isDark ? "bg-white/10 border-white/18" : "bg-white/70 border-gray-200"}`}
                onClick={e => e.stopPropagation()}
                style={{
                    maxHeight: "80vh",
                    padding: "16px"
                }}>
                <div className="flex justify-between items-center mb-4">
                    <h3
                        className={`font-bold text-xl ${isDark ? "text-white" : "text-gray-800"} flex items-center gap-2`}>
                        <i className="fas fa-bookmark"></i>书签显示管理
                                            </h3>
                    <button
                        onClick={onClose}
                        className={`text-xl p-1 rounded-full transition-colors ${isDark ? "text-gray-300 hover:text-white hover:bg-white/10" : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"}`}
                        aria-label="关闭">
                        <i className="fas fa-times"></i>
                    </button>
                </div>
                <p className={`mb-4 text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>在 "{activeTab === "home" ? "首页" : activeTab}" 标签下选择要显示的书签分类
                                    </p>
                {}
                <div
                    className={`flex items-center mb-3 p-2 rounded-lg ${isDark ? "bg-white/5" : "bg-gray-50"}`}>
                    <input
                        type="checkbox"
                        id="select-all"
                        checked={Object.values(selectedCategories).every(checked => checked)}
                        onChange={e => handleSelectAll(e.target.checked)}
                        className="accent-blue-400 h-4 w-4 cursor-pointer" />
                    <label
                        htmlFor="select-all"
                        className={`ml-2 text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>全选
                                            </label>
                </div>
                {}
                <div className="flex-1 overflow-y-auto pr-2 space-y-2 mb-4">
                    {nestedBookmarks.map(category => renderCategory(category))}
                </div>
                {}
                <div
                    className="flex justify-end gap-3 p-0 pt-2 mt-0 border-t border-opacity-20 border-gray-400">
                    <button
                        onClick={onClose}
                        className={`py-2.5 px-6 rounded-lg transition-colors ${isDark ? "bg-white/10 hover:bg-white/20 text-white border border-white/10" : "bg-white/80 hover:bg-white text-gray-800 border border-gray-200"} border`}>取消
                                            </button>
                    <button
                        onClick={handleSave}
                        className={`py-2.5 px-6 rounded-lg transition-colors ${isDark ? "bg-blue-600 hover:bg-blue-500 text-white" : "bg-blue-500 hover:bg-blue-600 text-white"}`}>保存设置
                                            </button>
                </div>
            </div>
        </div>
    );
};