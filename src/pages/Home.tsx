import React, { useState, useEffect, lazy, Suspense } from "react";
import { useTheme } from "@/hooks/useTheme";
import { Sidebar } from "@/components/Sidebar";
import { MenuItem, QuickLink,BookmarkCategory } from "@/types";
import { quickLinksData,  initialMenuItems, defaultBackgroundImage } from "@/data";//bookmarksData

import { useEnterpriseLinks } from "@/hooks/useEnterpriseLinks";
import { useDateTime } from "@/hooks/useDateTime";
import { useSearch } from "@/hooks/useSearch";
import { searchEngines } from "@/enum/searchEngines";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { PanelSkeleton, ModalSkeleton, GridSkeleton } from "@/components/Fallbacks";
import { UI_STORAGE_KEYS } from "@/enum/ui";


// 懒加载重组件，降低首屏体积
const TodoPanel = lazy(() => import("@/components/TodoPanel").then(m => ({ default: m.TodoPanel })));
const CalendarModal = lazy(() => import("@/components/CalendarModal").then(m => ({ default: m.CalendarModal })));
const SettingsPanel = lazy(() => import("@/components/SettingsPanel").then(m => ({ default: m.SettingsPanel })));
const BookmarksGrid = lazy(() => import("@/components/BookmarksGrid").then(m => ({ default: m.BookmarksGrid })));
const EnterpriseLinksGrid = lazy(() => import("@/components/EnterpriseLinksGrid").then(m => ({ default: m.EnterpriseLinksGrid })));
const MenuModal = lazy(() => import("@/components/MenuModal").then(m => ({ default: m.MenuModal })));
const QuickLinks = lazy(() => import("@/components/QuickLinks").then(m => ({ default: m.QuickLinks })));

export default function Home() {
    const { isDark, toggleTheme } = useTheme();
    const { enterpriseLinks } = useEnterpriseLinks();
    const { currentTime, currentDate, hasTodayEvents } = useDateTime();
    const {
        searchQuery,
        setSearchQuery,
        searchEngine,
        setSearchEngine,
        showSearchEngineDropdown,
        setShowSearchEngineDropdown,
        handleSearch
    } = useSearch();

    const [bookmarksData, setBookmarksData]=useState<BookmarkCategory[]>([])
    const [showTodoPanel, setShowTodoPanel] = useState(false);
    const [showSettingsPanel, setShowSettingsPanel] = useState(false);
    const [showMenuModal, setShowMenuModal] = useState(false);
    const [showCalendarModal, setShowCalendarModal] = useState(false);
    const [sidebarMode, setSidebarMode] = useState<"always" | "hover">(() => {
    const saved = localStorage.getItem(UI_STORAGE_KEYS.SIDEBAR_MODE);
    return (saved === "hover" || saved === "always") ? (saved as "always" | "hover") : "always";
  });
    const [activeMenuItem, setActiveMenuItem] = useState<string>(() => {
        const saved = localStorage.getItem(UI_STORAGE_KEYS.ACTIVE_MENU_ITEM);
        return saved || "home";
    });
    // 优先从localStorage获取菜单数据，如果没有则使用默认数据
    const getInitialMenuItems = () => {
        const savedMenuItems = localStorage.getItem(UI_STORAGE_KEYS.MENU_ITEMS);
        return savedMenuItems ? JSON.parse(savedMenuItems) : initialMenuItems;
    };
    
    // 优先从localStorage获取快捷链接数据，如果没有则使用默认数据
    const getInitialQuickLinks = () => {
        const savedQuickLinks = localStorage.getItem(UI_STORAGE_KEYS.QUICK_LINKS);
        if (savedQuickLinks) {
            const parsedLinks = JSON.parse(savedQuickLinks);
            // 处理可能存在的重复ID问题
            const uniqueLinks = fixDuplicateIds(parsedLinks);
            // 如果进行了修复，更新localStorage
            if (uniqueLinks.length !== parsedLinks.length) {
                localStorage.setItem(UI_STORAGE_KEYS.QUICK_LINKS, JSON.stringify(uniqueLinks));
            }
            return uniqueLinks;
        }
        return quickLinksData;
    };
    
    // 修复重复ID的辅助函数
    const fixDuplicateIds = (links: QuickLink[]): QuickLink[] => {
        const idSet = new Set<number>();
        const result: QuickLink[] = [];
        
        for (const link of links) {
            let newId = link.id;
            // 如果ID已存在，则生成新的唯一ID
            while (idSet.has(newId)) {
                newId = Date.now(); // 使用时间戳确保唯一性
            }
            idSet.add(newId);
            result.push({ ...link, id: newId });
        }
        
        return result;
    };

    const [menuItems, setMenuItems] = useState<MenuItem[]>(getInitialMenuItems());
    const [quickLinks, setQuickLinks] = useState<QuickLink[]>(getInitialQuickLinks());
    const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
    const [showQuickLinks, setShowQuickLinks] = useState(true); // 快捷链接显示设置，默认为true

    useEffect(() => {
        const savedBackground = localStorage.getItem(UI_STORAGE_KEYS.BACKGROUND_IMAGE);
        if (savedBackground) {
            setBackgroundImage(savedBackground);
        }
         // 加载快捷链接显示设置
        const savedShowQuickLinks = localStorage.getItem(UI_STORAGE_KEYS.SHOW_QUICK_LINKS);
         if (savedShowQuickLinks !== null) {
             setShowQuickLinks(savedShowQuickLinks === "true");
         }
    }, []);
    useEffect(() => {
        // console.log('书签数据响应:useEffect');
        // 监听书签数据响应
        const handleMessage = (request: any) => {
            // console.log('书签数据响应:handleMessage', request);
            if (request.type === 'BOOKMARKS') {
                try {
                    // console.log('书签数据响应:', request);
                    const rootNode = request?.payload?.children as BookmarkCategory[];
                    if (rootNode && Array.isArray(rootNode)) {
                        setBookmarksData(rootNode);
                    }
                } catch (error) {
                    console.error('处理书签数据时出错:', error);
                }
            }
        };

        // 注册消息监听器 (处理来自 background 的自发更新，如书签改变时)
        // @ts-ignore
        if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
            // @ts-ignore
            chrome.runtime.onMessage.addListener(handleMessage);
        }

        // 主动请求函数
        const fetchBookmarks = (retryCount = 0) => {
            // @ts-ignore
            if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
                // @ts-ignore
                chrome.runtime.sendMessage({ action: "GET_BOOKMARKS" }, (response: any) => {
                    // @ts-ignore
                    if (chrome.runtime.lastError) {
                        // @ts-ignore
                        console.warn(`获取书签请求失败 (重试 ${retryCount}):`, chrome.runtime.lastError.message);
                        if (retryCount < 3) {
                            setTimeout(() => fetchBookmarks(retryCount + 1), 500);
                        }
                        return;
                    }

                    if (response && response.type === 'BOOKMARKS' && response.success) {
                       
                        const rootNode = response.payload?.children as BookmarkCategory[];
                        
                        if (rootNode && Array.isArray(rootNode)) {
                            // console.log('书签数据响应:___fetchBookmarks', rootNode);
                            setBookmarksData(rootNode);
                        }
                    } else if (retryCount < 3) {
                        // 如果响应不符合预期，尝试重试
                        console.warn(`获取书签响应异常 (重试 ${retryCount}):`, response);
                        setTimeout(() => fetchBookmarks(retryCount + 1), 500);
                    }
                });
            }
        };

        fetchBookmarks();

        // 清理函数
        return () => {
            // @ts-ignore
            if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
                // @ts-ignore
                chrome.runtime.onMessage.removeListener(handleMessage);
            }
        };
    }, []);




    useEffect(() => {
        localStorage.setItem(UI_STORAGE_KEYS.MENU_ITEMS, JSON.stringify(menuItems));
    }, [menuItems]);

     useEffect(() => {
        localStorage.setItem(UI_STORAGE_KEYS.QUICK_LINKS, JSON.stringify(quickLinks));
    }, [quickLinks]);
    
    // 保存快捷链接显示设置到localStorage（去重，保留一处）
    useEffect(() => {
        localStorage.setItem(UI_STORAGE_KEYS.SHOW_QUICK_LINKS, JSON.stringify(showQuickLinks));
    }, [showQuickLinks]);
    
    // 缓存当前激活的菜单项，初始化时从缓存恢复，缺省为 home
    useEffect(() => {
        localStorage.setItem(UI_STORAGE_KEYS.ACTIVE_MENU_ITEM, activeMenuItem);
    }, [activeMenuItem]);

    // 缓存侧边栏模式（always/hover）
    useEffect(() => {
        localStorage.setItem(UI_STORAGE_KEYS.SIDEBAR_MODE, sidebarMode);
    }, [sidebarMode]);


    const handeleMenuItems = (value: React.SetStateAction<MenuItem[]>) => {
        // 根据传入值的类型处理
        const newItems = typeof value === 'function' ? value(menuItems) : value;
        setMenuItems(newItems);
        localStorage.setItem(UI_STORAGE_KEYS.MENU_ITEMS, JSON.stringify(newItems));    
    };
    const handleAddMenuItem = (newItem: MenuItem) => {
        handeleMenuItems([...menuItems, newItem]);
    };

    const toggleTodoPanel = () => {
        setShowTodoPanel(!showTodoPanel);
    };

    const toggleCalendarModal = () => {
        setShowCalendarModal(!showCalendarModal);
    };
    
    // 切换快捷链接显示状态
    const toggleShowQuickLinks = () => {
        setShowQuickLinks(prev => !prev);
    };

    // 计算背景图：企业链接页优先使用 companyImage；否则使用用户配置背景
    const companyImage = localStorage.getItem(UI_STORAGE_KEYS.COMPANY_IMAGE);
    const effectiveBackground = (activeMenuItem === 'enterprise' && companyImage)
        ? companyImage
        : (backgroundImage || defaultBackgroundImage);

    const backgroundStyle = {
        backgroundImage: `url(${effectiveBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center"
    };

    return (
        <div
            className={`h-screen flex overflow-hidden font-sans`}
            style={backgroundStyle}
            onContextMenu={e => e.preventDefault()}>
            <div
                className={`absolute inset-0 bg-gradient-to-br ${isDark ? "from-blue-900/70 to-orange-500/30" : "from-blue-300/30 to-orange-200/20"} mix-blend-multiply`}></div>
            <Sidebar
                    menuItems={menuItems}
                    setMenuItems={setMenuItems}
                    activeMenuItem={activeMenuItem}
                    setActiveMenuItem={setActiveMenuItem}
                    bookmark={bookmarksData}
                    setShowSettingsPanel={setShowSettingsPanel}
                    sidebarMode={sidebarMode} />
            <div
                className={`relative z-10 flex-1 ${sidebarMode === "always" ? "ml-[60px]" : "ml-0"} p-4 sm:p-6 lg:p-8 flex flex-col items-center transition-all duration-300 h-screen overflow-hidden`}
                onContextMenu={e => e.preventDefault()}>
                <div
                    className="w-full max-w-7xl mx-auto flex justify-between items-center py-4">
                    <div className="flex flex-col items-start gap-1">
                        <div className="flex items-center gap-2">
                            <button
                                onClick={toggleCalendarModal}
                                className={`hover:text-gray-300 transition-colors ${isDark ? "text-white" : "text-gray-800"} relative flex items-center justify-center w-8 h-8`}>
                                <i
                                    className="fas fa-calendar text-lg"
                                    style={{
                                        lineHeight: "1.2"
                                    }}></i>
                                {hasTodayEvents && <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500"></span>}
                            </button>
                            <span
                                className={`text-2xl font-bold transition-all duration-300 ease-in-out transform ${isDark ? "text-white" : "text-gray-800"}`}
                                key={currentTime}
                                style={{
                                    lineHeight: "1.2"
                                }}>{currentTime}</span>
                        </div>
                        <p className={`text-sm ${isDark ? "text-white/70" : "text-gray-600"}`}>{currentDate}</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={toggleTodoPanel}
                            className={`hover:text-gray-300 transition-colors ${isDark ? "text-white" : "text-gray-800"}`}
                            style={{
                                padding: "8px"
                            }}>
                            <i className="fas fa-list-ul text-xl"></i>
                        </button>
                        <button
                            onClick={toggleTheme}
                            className={`hover:text-gray-300 transition-colors ${isDark ? "text-white" : "text-gray-800"}`}>
                            <i className={`fas ${isDark ? "fa-sun" : "fa-moon"} text-xl`}></i>
                        </button>
                    </div>
                </div>
                <ErrorBoundary fallback={<PanelSkeleton />}>
                  <Suspense fallback={<PanelSkeleton />}>
                <TodoPanel show={showTodoPanel} onClose={toggleTodoPanel} />
                  </Suspense>
                </ErrorBoundary>
                <ErrorBoundary fallback={<ModalSkeleton />}>
                  <Suspense fallback={<ModalSkeleton />}>
                <CalendarModal show={showCalendarModal} onClose={toggleCalendarModal} />
                  </Suspense>
                </ErrorBoundary>
                <div className="w-full max-w-2xl my-6">
                    <form onSubmit={handleSearch} className="relative">
                        <div className="absolute z-[38] left-3 top-1/2 transform -translate-y-1/2">
                            <div className={`relative z-10`}>
                                <button
                                    type="button"
                                    onClick={e => {
                                        e.stopPropagation();
                                        setShowSearchEngineDropdown(!showSearchEngineDropdown);
                                    }}
                                    className={`flex items-center gap-1 px-3 py-1.5 rounded-md transition-colors ${isDark ? "text-white hover:bg-white/10" : "text-gray-800 hover:bg-gray-100"} font-medium`}>
                                    <span>{searchEngine}</span>
                                    <i
                                        className={`fas fa-chevron-down text-xs transition-transform duration-300 ${showSearchEngineDropdown ? "rotate-180" : ""}`}></i>
                                </button>
                                {showSearchEngineDropdown && (
                                    <div
                                        className={`absolute left-0 mt-1 w-32 rounded-lg shadow-xl z-[100] ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} border overflow-hidden transform transition-all duration-300`}
                                        onClick={e => e.stopPropagation()}>
                                        {searchEngines && searchEngines.map(engine => (
                                            <button
                                                key={engine.value}
                                                type="button"
                                                onClick={e => {
                                                    e.stopPropagation();
                                                    setSearchEngine(engine.label);
                                                    setShowSearchEngineDropdown(false);
                                                }}
                                                className={`w-full text-left px-3 py-2 text-sm transition-colors ${searchEngine === engine.label ? isDark ? "bg-blue-900/50 text-white" : "bg-blue-50 text-blue-700" : isDark ? "text-gray-300 hover:bg-gray-700" : "text-gray-700 hover:bg-gray-100"}`}>
                                                {engine.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                placeholder={`在${searchEngine}中搜索...`}
                                className={`w-full backdrop-blur-md rounded-full pl-24 pr-12 py-3 border focus:outline-none focus:ring-2 shadow-lg ${isDark ? "bg-white/20 border-white/18 text白 placeholder-gray-300 focus:ring-white/30" : "bg白/80 border-gray-300 text-gray-800 placeholder-gray-500 focus:ring-blue-300"}`} />
                        <button
                            type="submit"
                            className={`absolute right-5 top-1/2 transform -translate-y-1/2 ${isDark ? "text-white" : "text-gray-600"}`}>
                            <i className="fas fa-search"></i>
                        </button>
                    </form>
                </div>
                 {/* 根据设置决定是否显示快捷链接 */}
                 {showQuickLinks && (
                   <ErrorBoundary fallback={<GridSkeleton />}>
                     <Suspense fallback={<GridSkeleton />}>
                     <QuickLinks
                         quickLinks={quickLinks}
                         onAddLink={(newLink: QuickLink) => {
                             setQuickLinks([...quickLinks, newLink]);
                         }}
                         onUpdateLink={(updatedLink: QuickLink) => {
                             setQuickLinks(quickLinks.map(link => link.id === updatedLink.id ? updatedLink : link));
                         }}
                         onDeleteLink={(linkId: number) => {
                             setQuickLinks(quickLinks.filter(link => link.id !== linkId));
                            }}
                        />
                     </Suspense>
                   </ErrorBoundary>
                 )}
                <ErrorBoundary fallback={<GridSkeleton />}>
                  <Suspense fallback={<GridSkeleton />}>
                    {activeMenuItem === "enterprise" && enterpriseLinks && enterpriseLinks.length > 0 
                        ? <EnterpriseLinksGrid enterpriseLinks={enterpriseLinks} isDark={isDark} /> 
                        : bookmarksData && bookmarksData.length>0 ? <BookmarksGrid bookmarks={bookmarksData} activeCategory={activeMenuItem} /> :''}
                  </Suspense>
                </ErrorBoundary>
            </div>
            <ErrorBoundary fallback={<ModalSkeleton />}>
              <Suspense fallback={<ModalSkeleton />}>
            <SettingsPanel
                show={showSettingsPanel}
                onClose={() => setShowSettingsPanel(false)}
                backgroundImage={backgroundImage}
                setBackgroundImage={setBackgroundImage}
                sidebarMode={sidebarMode}
                setSidebarMode={setSidebarMode}
                showQuickLinks={showQuickLinks}
                    toggleShowQuickLinks={toggleShowQuickLinks}
                    bookmarks={bookmarksData} />
              </Suspense>
            </ErrorBoundary>
            <ErrorBoundary fallback={<ModalSkeleton />}>
              <Suspense fallback={<ModalSkeleton />}>
            <MenuModal
                show={showMenuModal}
                onClose={() => setShowMenuModal(false)}
                onAdd={handleAddMenuItem}
                onUpdate={() => {}}
                mode="add" />
              </Suspense>
            </ErrorBoundary>
        </div>
    );
}
