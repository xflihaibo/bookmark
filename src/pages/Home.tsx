// 导入独立的企业链接网格组件
import { EnterpriseLinksGrid } from "@/components/EnterpriseLinksGrid";

import { useState, useEffect } from "react";
import { useTheme } from "@/hooks/useTheme";
import { Sidebar } from "@/components/Sidebar";
import { TodoPanel } from "@/components/TodoPanel";
import { QuickLinks } from "@/components/QuickLinks";
import { BookmarksGrid } from "@/components/BookmarksGrid";
import { SettingsPanel } from "@/components/SettingsPanel";
import { CalendarModal } from "@/components/CalendarModal";
import { MenuModal } from "@/components/MenuModal";
import { MenuItem, QuickLink } from "@/types";
import { quickLinksData, bookmarksData, initialMenuItems, defaultBackgroundImage } from "@/data";
import { useEnterpriseLinks } from "@/hooks/useEnterpriseLinks";
import { useDateTime } from "@/hooks/useDateTime";
import { useSearch } from "@/hooks/useSearch";
import { searchEngines } from "@/enum/searchEngines";

export default function Home() {
    const {
        isDark,
        toggleTheme
    } = useTheme();

    const {
        enterpriseLinks
    } = useEnterpriseLinks();

    const {
        currentTime,
        currentDate,
        hasTodayEvents
    } = useDateTime();

    const {
        searchQuery,
        setSearchQuery,
        searchEngine,
        setSearchEngine,
        showSearchEngineDropdown,
        setShowSearchEngineDropdown,
        handleSearch
    } = useSearch();

    const [showTodoPanel, setShowTodoPanel] = useState(false);
    const [showSettingsPanel, setShowSettingsPanel] = useState(false);
    const [showMenuModal, setShowMenuModal] = useState(false);
    const [showCalendarModal, setShowCalendarModal] = useState(false);
    const [sidebarMode, setSidebarMode] = useState<"always" | "hover">("always");
    const [activeMenuItem, setActiveMenuItem] = useState("home");
    const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);
    const [quickLinks, setQuickLinks] = useState<QuickLink[]>(quickLinksData);
    const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
    const [showQuickLinks, setShowQuickLinks] = useState(true); // 快捷链接显示设置，默认为true
    const [showAddMenuModal, setShowAddMenuModal] = useState(false);

    useEffect(() => {
        const savedBackground = localStorage.getItem("backgroundImage");

        if (savedBackground) {
            setBackgroundImage(savedBackground);
        }

        const savedMenuItems = localStorage.getItem("menuItems");

        if (savedMenuItems) {
            setMenuItems(JSON.parse(savedMenuItems));
        }

         const savedQuickLinks = localStorage.getItem("quickLinks");

         if (savedQuickLinks) {
             setQuickLinks(JSON.parse(savedQuickLinks));
         }
         
         // 加载快捷链接显示设置
         const savedShowQuickLinks = localStorage.getItem("showQuickLinks");
         if (savedShowQuickLinks !== null) {
             setShowQuickLinks(savedShowQuickLinks === "true");
         }
    }, []);

    useEffect(() => {
        localStorage.setItem("menuItems", JSON.stringify(menuItems));
    }, [menuItems]);

     useEffect(() => {
        localStorage.setItem("quickLinks", JSON.stringify(quickLinks));
    }, [quickLinks]);
    
    // 保存快捷链接显示设置到localStorage
    useEffect(() => {
        localStorage.setItem("showQuickLinks", JSON.stringify(showQuickLinks));
    }, [showQuickLinks]);
    
    // 保存快捷链接显示设置到localStorage
    useEffect(() => {
        localStorage.setItem("showQuickLinks", JSON.stringify(showQuickLinks));
    }, [showQuickLinks]);

    const handleAddMenuItem = (newItem: MenuItem) => {
        setMenuItems([...menuItems, newItem]);
        setShowAddMenuModal(false);
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

    const backgroundStyle = {
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : `url(${defaultBackgroundImage})`,
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
                <TodoPanel show={showTodoPanel} onClose={toggleTodoPanel} />
                <CalendarModal show={showCalendarModal} onClose={toggleCalendarModal} />
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
                                className={`w-full backdrop-blur-md rounded-full pl-24 pr-12 py-3 border focus:outline-none focus:ring-2 shadow-lg ${isDark ? "bg-white/20 border-white/18 text-white placeholder-gray-300 focus:ring-white/30" : "bg-white/80 border-gray-300 text-gray-800 placeholder-gray-500 focus:ring-blue-300"}`} />
                        <button
                            type="submit"
                            className={`absolute right-5 top-1/2 transform -translate-y-1/2 ${isDark ? "text-white" : "text-gray-600"}`}>
                            <i className="fas fa-search"></i>
                        </button>
                    </form>
                </div>
                 {/* 根据设置决定是否显示快捷链接 */}
                 {showQuickLinks && (
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
                         }} />
                 )}
                {activeMenuItem === "enterprise" && enterpriseLinks && enterpriseLinks.length > 0 ? <EnterpriseLinksGrid enterpriseLinks={enterpriseLinks} isDark={isDark} /> : <BookmarksGrid bookmarks={bookmarksData} activeCategory={activeMenuItem} />}
            </div>
            <SettingsPanel
                show={showSettingsPanel}
                onClose={() => setShowSettingsPanel(false)}
                backgroundImage={backgroundImage}
                setBackgroundImage={setBackgroundImage}
                sidebarMode={sidebarMode}
                setSidebarMode={setSidebarMode}
                showQuickLinks={showQuickLinks}
                toggleShowQuickLinks={toggleShowQuickLinks} />
            <MenuModal
                show={showMenuModal}
                onClose={() => setShowMenuModal(false)}
                onAdd={handleAddMenuItem}
                onUpdate={() => {}}
                mode="add" />
        </div>
    );
}