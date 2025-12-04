import { ThemeSettingsProps } from "@/types";
import { presetBackgrounds } from "@/enum/backgrounds";

export const ThemeSettings: React.FC<ThemeSettingsProps> = (
    {
        isDark,
        theme,
        toggleTheme,
        sidebarMode,
        setSidebarMode,
        backgroundImage,
        setBackground,
        resetBackground,
        handleBackgroundUpload,
        handleManageQuickLinks,
        showQuickLinks,
        toggleShowQuickLinks
    }
) => {
    return (
        <div>
            {}
            <div
                className={`mb-8 p-5 rounded-xl border ${isDark ? "bg-gray-700/40 border-gray-600" : "bg-gray-50 border-gray-200"}`}>
                <h3
                    className={`text-lg font-semibold mb-4 flex items-center gap-2 ${isDark ? "text-white" : "text-gray-800"}`}>
                    <i className={`fas ${isDark ? "fa-moon" : "fa-sun"}`}></i>主题模式
                </h3>
                <div className="flex items-center gap-4">
                    <span className={`text-base ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                        {theme === "light" ? "亮色模式" : "暗色模式"}
                    </span>
                    <button
                        onClick={toggleTheme}
                        className={`relative w-24 h-12 rounded-full transition-all duration-300 ease-in-out ${isDark ? "bg-blue-900" : "bg-gray-300"}`}
                        aria-label={isDark ? "切换到亮色模式" : "切换到暗色模式"}>
                        <div
                            className={`w-10 h-10 rounded-full transition-all duration-300 ease-in-out ${isDark ? "bg-white translate-x-[calc(100%-2.5rem)] shadow-md shadow-blue-600/30" : "bg-white translate-x-1 shadow-md shadow-gray-400/30"}`}>
                            <i
                                className={`fas ${isDark ? "fa-sun" : "fa-moon"} text-center w-full h-full flex items-center justify-center text-sm ${isDark ? "text-yellow-500" : "text-gray-700"}`}></i>
                        </div>
                    </button>
                </div>
                
                {/* 快捷链接显示开关 */}
                <div className="mt-6 flex items-center gap-4">
                    <span className={`text-base ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                        快捷链接显示
                    </span>
                    <button
                        onClick={toggleShowQuickLinks}
                        className={`relative w-24 h-12 rounded-full transition-all duration-300 ease-in-out ${showQuickLinks ? (isDark ? "bg-blue-900" : "bg-green-500") : (isDark ? "bg-gray-700" : "bg-gray-300")}`}
                        aria-label={showQuickLinks ? "隐藏快捷链接" : "显示快捷链接"}>
                        <div
                            className={`w-10 h-10 rounded-full transition-all duration-300 ease-in-out ${showQuickLinks ? (isDark ? "bg-white translate-x-[calc(100%-2.5rem)] shadow-md shadow-blue-600/30" : "bg-white translate-x-[calc(100%-2.5rem)] shadow-md shadow-green-500/30") : (isDark ? "bg-white translate-x-1 shadow-md shadow-gray-600/30" : "bg-white translate-x-1 shadow-md shadow-gray-400/30")}`}>
                            <i
                                className={`fas ${showQuickLinks ? "fa-check" : "fa-times"} text-center w-full h-full flex items-center justify-center text-sm ${showQuickLinks ? (isDark ? "text-green-500" : "text-green-600") : (isDark ? "text-red-400" : "text-red-500")}`}></i>
                        </div>
                    </button>
                </div>
            </div>
            {}
            <div
                className={`mb-6 p-4 rounded-xl border ${isDark ? "bg-gray-700/40 border-gray-600" : "bg-gray-50 border-gray-200"}`}>
                <h3
                    className={`text-lg font-semibold mb-3 flex items-center gap-2 ${isDark ? "text-white" : "text-gray-800"}`}>
                    <i className="fas fa-columns"></i>侧边栏设置
                </h3>
                <div className="flex space-x-4">
                    {}
                    <div
                        className={`flex flex-col items-center p-3 rounded-xl transition-all duration-300 transform ${sidebarMode === "always" ? `${isDark ? "bg-blue-900/30 border-blue-500/50 shadow-lg shadow-blue-900/20" : "bg-blue-50 border-blue-200 shadow-lg shadow-blue-100"}` : `${isDark ? "bg-gray-700/50 border-gray-600 hover:bg-gray-700/70" : "bg-gray-100 border-gray-200 hover:bg-gray-200"}`} border cursor-pointer flex-1 hover:scale-[1.02]`}>
                        <div className="flex items-center gap-2 mb-2 w-full">
                            <input
                                type="radio"
                                id="sidebar-always"
                                name="sidebar-mode"
                                checked={sidebarMode === "always"}
                                onChange={() => setSidebarMode("always")}
                                className="accent-blue-500 h-4 w-4" />
                            <label
                                htmlFor="sidebar-always"
                                className={`font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>常驻显示
                            </label>
                        </div>
                        {}
                        <div className="w-full h-14 rounded-lg overflow-hidden relative mb-2">
                            <div
                                className={`absolute left-0 top-0 bottom-0 w-[60px] ${isDark ? "bg-black/20" : "bg-white/10"} backdrop-blur-lg flex items-center justify-center`}>
                                <div className="w-6 h-6 rounded-full bg-blue-500 opacity-70"></div>
                            </div>
                            <div
                                className={`absolute left-12 top-0 right-0 bottom-0 ${isDark ? "bg-gray-800/40" : "bg-white/40"} backdrop-blur-sm`}></div>
                        </div>
                        <p
                            className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"} text-center`}>侧边栏始终可见</p>
                    </div>
                    {}
                    <div
                        className={`flex flex-col items-center p-3 rounded-xl transition-all duration-300 transform ${sidebarMode === "hover" ? `${isDark ? "bg-blue-900/30 border-blue-500/50 shadow-lg shadow-blue-900/20" : "bg-blue-50 border-blue-200 shadow-lg shadow-blue-100"}` : `${isDark ? "bg-gray-700/50 border-gray-600 hover:bg-gray-700/70" : "bg-gray-100 border-gray-200 hover:bg-gray-200"}`} border cursor-pointer flex-1 hover:scale-[1.02]`}>
                        <div className="flex items-center gap-2 mb-2 w-full">
                            <input
                                type="radio"
                                id="sidebar-hover"
                                name="sidebar-mode"
                                checked={sidebarMode === "hover"}
                                onChange={() => setSidebarMode("hover")}
                                className="accent-blue-500 h-4 w-4" />
                            <label
                                htmlFor="sidebar-hover"
                                className={`font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>鼠标移入显示
                            </label>
                        </div>
                        {}
                        <div className="w-full h-14 rounded-lg overflow-hidden relative mb-2">
                            <div
                                className={`absolute top-0 bottom-0 left-0 w-[60px] ${isDark ? "bg-black/20" : "bg-white/10"} backdrop-blur-lg flex items-center justify-center transform -translate-x-full`}>
                                <div className="w-6 h-6 rounded-full bg-blue-500 opacity-70"></div>
                            </div>
                            <div
                                className={`absolute top-0 bottom-0 left-0 right-0 ${isDark ? "bg-gray-800/40" : "bg-white/40"} backdrop-blur-sm`}></div>
                            <div
                                className="absolute left-0 top-1/2 transform -translate-y-1/2 w-2 h-8 bg-blue-500/50 rounded-r-full"></div>
                        </div>
                        <p
                            className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"} text-center`}>鼠标靠近时显示侧边栏</p>
                    </div>
                </div>
            </div>
            {}
            <div
                className={`mb-8 p-5 rounded-xl border ${isDark ? "bg-gray-700/40 border-gray-600" : "bg-gray-50 border-gray-200"}`}>
                <h3
                    className={`text-lg font-semibold mb-4 flex items-center gap-2 ${isDark ? "text-white" : "text-gray-800"}`}>
                    <i className="fas fa-image"></i>背景设置
                </h3>
                <p className={`mb-4 text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>自定义您的主页背景，打造专属工作环境
                </p>
                {}
                <div className="mb-6">
                    <h4
                        className={`font-medium mb-3 text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>选择预设背景</h4>
                    <div className="grid grid-cols-5 gap-3">
                        {presetBackgrounds.map((imageUrl, index) => <div
                            key={index}
                            className={`rounded-lg overflow-hidden cursor-pointer transition-all duration-300 transform hover:scale-[1.03] shadow-md ${backgroundImage === imageUrl ? "ring-2 ring-blue-500 shadow-blue-500/20" : "ring-2 ring-transparent hover:ring-gray-400/30"}`}
                            onClick={() => setBackground(imageUrl)}
                            title={`预设背景 ${index + 1}`}>
                            <img
                                src={imageUrl}
                                alt={`Preset background ${index + 1}`}
                                className="w-full h-20 object-cover transition-transform duration-500 hover:scale-110" />
                        </div>)}
                    </div>
                </div>
                {}
                <div className="mb-4">
                    <h4
                        className={`font-medium mb-3 text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>上传自定义背景</h4>
                    <div className="relative">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleBackgroundUpload}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                        <button
                            type="button"
                            className={`w-full py-3 px-4 rounded-lg border transition-all duration-300 ${isDark ? "bg-gray-700 hover:bg-gray-600 border-gray-600 text-white" : "bg-gray-100 hover:bg-gray-200 border-gray-200 text-gray-800"}`}>
                            <i className="fas fa-upload mr-2"></i>选择本地图片
                        </button>
                    </div>
                </div>
                {}
                <button
                    onClick={resetBackground}
                    className={`text-sm font-medium transition-colors duration-300 flex items-center gap-1 ${isDark ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-700"}`}>
                    <i className="fas fa-redo-alt"></i>恢复默认背景
                </button>
            </div>
            {}
            <></>
        </div>
    );
};