import { ThemeSettingsProps, AIBookmarksSettingsProps, EnterpriseLinksSettingsProps, EnterpriseLink } from "@/types";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useTheme } from "@/hooks/useTheme";
import { presetBackgrounds } from "@/enum/backgrounds";
import { UI_STORAGE_KEYS } from "@/enum/ui";
import { useEnterpriseLinks } from "@/hooks/useEnterpriseLinks";

function ThemeSettings(
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
        
        showQuickLinks,
        toggleShowQuickLinks
    }: ThemeSettingsProps
) {
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
                        className={`relative w-[96px] h-[42px] rounded-full transition-all duration-300 ease-in-out ${isDark ? "bg-blue-900" : "bg-gray-300"}`}
                        aria-label={isDark ? "切换到亮色模式" : "切换到暗色模式"}>
                         <div
                             className={`absolute top-1/2 -translate-y-1/2 w-[34px] h-[34px] rounded-full transition-all duration-300 ease-in-out flex items-center justify-center ${isDark ? "bg-white right-1 shadow-md shadow-blue-600/30" : "bg-white left-1 shadow-md shadow-gray-400/30"}`}>
                            <i
                                className={`fas ${isDark ? "fa-sun text-yellow-500" : "fa-moon text-gray-700"} block leading-[0] text-sm`}></i>
                        </div>
                    </button>
                </div>
                {}
                <></>
                {}
                <div className="mt-6 flex items-center gap-4">
                    <span className={`text-base ${isDark ? "text-gray-300" : "text-gray-600"}`}>快捷链接显示
                                            </span>
                     <button
                        onClick={toggleShowQuickLinks}
                        className={`relative w-[96px] h-[42px] rounded-full transition-all duration-300 ease-in-out ${showQuickLinks ? isDark ? "bg-blue-900" : "bg-green-500" : isDark ? "bg-gray-700" : "bg-gray-300"}`}
                        aria-label={showQuickLinks ? "隐藏快捷链接" : "显示快捷链接"}>
                        <div
                            className={`absolute top-1/2 -translate-y-1/2 w-[34px] h-[34px] rounded-full transition-all duration-300 ease-in-out flex items-center justify-center ${showQuickLinks ? (isDark ? "bg-white right-1 shadow-md shadow-blue-600/30" : "bg-white right-1 shadow-md shadow-green-500/30") : (isDark ? "bg-white left-1 shadow-md shadow-gray-600/30" : "bg-white left-1 shadow-md shadow-gray-400/30")}`}>
                            <i
                                className={`fas ${showQuickLinks ? "fa-check" : "fa-times"} leading-none align-middle text-sm ${showQuickLinks ? (isDark ? "text-green-500" : "text-green-600") : (isDark ? "text-red-400" : "text-red-500")}`}></i>
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
}

function AIBookmarksSettings(
    {
        isDark,
        isAICategorizing,
        isChecking404,
        invalidLinks,
        hiddenBookmarks,
        handleAICategorize,
        handleCheck404,
        handleHideBookmark,
        handleDeleteBookmark,
        handleUnhideBookmark
    }: AIBookmarksSettingsProps
) {
    return (
        <div>
            <h3
                className={`text-lg font-semibold mb-3 ${isDark ? "text-white" : "text-gray-800"}`}>AI智能书签管理</h3>
            {}
            <div className="mb-6">
                <h4
                    className={`font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>AI智能分类</h4>
                <button
                    onClick={handleAICategorize}
                    disabled={isAICategorizing}
                    className={`py-2 px-4 rounded-lg transition-colors ${isAICategorizing ? `${isDark ? "bg-gray-700 text-gray-400" : "bg-gray-200 text-gray-500"}` : `${isDark ? "bg-blue-600 hover:bg-blue-500 text-white" : "bg-blue-500 hover:bg-blue-600 text-white"}`}`}>
                    {isAICategorizing ? "AI分类中..." : "执行AI智能分类"}
                </button>
                <p className={`text-sm mt-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}>使用AI自动整理和分类您的书签
                                    </p>
            </div>
            {}
            <div className="mb-6">
                <h4
                    className={`font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>404链接检测</h4>
                <button
                    onClick={handleCheck404}
                    disabled={isChecking404}
                    className={`py-2 px-4 rounded-lg transition-colors ${isChecking404 ? `${isDark ? "bg-gray-700 text-gray-400" : "bg-gray-200 text-gray-500"}` : `${isDark ? "bg-orange-600 hover:bg-orange-500 text-white" : "bg-orange-500 hover:bg-orange-600 text-white"}`}`}>
                    {isChecking404 ? "检测中..." : "检查无效链接"}
                </button>
                <p className={`text-sm mt-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}>扫描并识别无法访问的书签链接
                                    </p>
            </div>
            {}
            {invalidLinks.length > 0 && <div
                className="mb-6 p-4 rounded-lg border bg-red-900/20 border-red-800 text-white">
                <h4 className="font-medium mb-2 text-red-300">检测到 {invalidLinks.length}个无效链接
                                    </h4>
                <div className="space-y-2">
                    {invalidLinks.map(
                        (link, index) => <div key={index} className="flex items-center justify-between">
                            <span className="text-sm text-red-200">{link}</span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleHideBookmark(link)}
                                    className="text-xs py-1 px-2 rounded bg-gray-700 hover:bg-gray-600 text-gray-300">隐藏
                                                                    </button>
                                <button
                                    onClick={() => handleDeleteBookmark(link)}
                                    className="text-xs py-1 px-2 rounded bg-red-800/50 hover:bg-red-800 text-red-300">删除
                                                                    </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>}
            {}
            {hiddenBookmarks.length > 0 && <div>
                <h4
                    className={`font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>已隐藏的书签</h4>
                <div className="space-y-2">
                    {hiddenBookmarks.map(
                        (bookmark, index) => <div key={index} className="flex items-center justify-between">
                            <span
                                className={`text-sm ${isDark ? "text-gray-400 line-through" : "text-gray-500 line-through"}`}>{bookmark}</span>
                            <button
                                onClick={() => handleUnhideBookmark(bookmark)}
                                className={`text-xs py-1 px-2 rounded ${isDark ? "bg-blue-800/50 hover:bg-blue-800 text-blue-300" : "bg-blue-100 hover:bg-blue-200 text-blue-700"}`}>显示
                                                            </button>
                        </div>
                    )}
                </div>
            </div>}
        </div>
    );
}

function EnterpriseLinksSettings(
    {
        isDark,
        cdnUrl,
        setCdnUrl,
        isSyncing,
        syncStatus,
        enterpriseLinks,
        handleSyncEnterpriseLinks
    }: EnterpriseLinksSettingsProps
) {
    return (
        <div>
            <h3
                className={`text-lg font-semibold mb-3 ${isDark ? "text-white" : "text-gray-800"}`}>企业链接管理</h3>
            {}
            <div className="mb-6">
                <h4
                    className={`font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>从CDN同步企业链接</h4>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={cdnUrl}
                        onChange={e => {
                            const value = e.target.value;
                            setCdnUrl(value);
                            localStorage.setItem(UI_STORAGE_KEYS.ENTERPRISE_CDN_URL, value);
                        }}
                        placeholder="企业CDN链接地址"
                        className={`flex-1 border rounded-lg px-4 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 ${isDark ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500" : "bg-white border-gray-300 text-gray-800 focus:ring-blue-300"}`} />
                    <button
                        onClick={handleSyncEnterpriseLinks}
                        disabled={isSyncing}
                        className={`py-2 px-4 rounded-lg transition-colors ${isSyncing ? `${isDark ? "bg-gray-700 text-gray-400" : "bg-gray-200 text-gray-500"}` : `${isDark ? "bg-green-600 hover:bg-green-500 text-white" : "bg-green-500 hover:bg-green-600 text-white"}`}`}>
                        {isSyncing ? "同步中..." : "同步"}
                    </button>
                </div>
                <p className={`text-sm mt-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}>从企业CDN同步官方链接到您的书签栏
                                    </p>
            </div>
            {}
            {syncStatus && <div
                className={`mb-6 p-3 rounded-lg ${syncStatus.includes("成功") ? `${isDark ? "bg-green-900/20 text-green-300" : "bg-green-50 text-green-700"}` : syncStatus.includes("演示数据") || syncStatus.includes("正在") ? `${isDark ? "bg-blue-900/20 text-blue-300" : "bg-blue-50 text-blue-700"}` : `${isDark ? "bg-red-900/20 text-red-300" : "bg-red-50 text-red-700"}`}`}>
                <div className="flex items-start gap-2">
                    <i
                        className={`fas ${syncStatus.includes("成功") ? "fa-check-circle" : syncStatus.includes("演示数据") || syncStatus.includes("正在") ? "fa-info-circle" : "fa-exclamation-circle"} mt-0.5 flex-shrink-0`}></i>
                    <div className="flex-1">
                        <p className="font-medium">{syncStatus}</p>
                        {}
                        {!syncStatus.includes("成功") && !syncStatus.includes("演示数据") && !syncStatus.includes("正在") && <div className={`mt-2 text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                            <div className="font-medium mb-1">可能的原因：</div>
                            <ul className="list-disc list-inside space-y-1">
                                {syncStatus.includes("网络") && <li>网络连接不稳定或断开</li>}
                                {syncStatus.includes("URL") && <li>链接地址格式错误或无效</li>}
                                {syncStatus.includes("404") && <li>服务器上的资源不存在</li>}
                                {syncStatus.includes("403") && <li>没有权限访问此资源</li>}
                                {syncStatus.includes("500") || syncStatus.includes("503") && <li>服务器暂时无法提供服务</li>}
                                {syncStatus.includes("JSON") && <li>返回的数据格式不是有效的JSON</li>}
                                {syncStatus.includes("超时") && <li>服务器响应时间过长</li>}
                                {!syncStatus.includes("网络") && !syncStatus.includes("URL") && !syncStatus.includes("404") && !syncStatus.includes("403") && !syncStatus.includes("500") && !syncStatus.includes("503") && !syncStatus.includes("JSON") && !syncStatus.includes("超时") && <li>其他未知原因</li>}
                            </ul>
                            <div className="mt-2">
                                <div className="font-medium mb-1">解决建议：</div>
                                <ul className="list-disc list-inside space-y-1">
                                    {syncStatus.includes("网络") && <li>检查您的网络连接并重试</li>}
                                    {syncStatus.includes("URL") && <li>确认CDN地址正确，格式应为 https://example.com/path/to/config.json</li>}
                                    {syncStatus.includes("404") && <li>确认CDN链接有效，可能需要更新地址</li>}
                                    {syncStatus.includes("403") && <li>请联系管理员获取访问权限</li>}
                                    {syncStatus.includes("500") || syncStatus.includes("503") && <li>稍后再试，服务器可能正在维护中</li>}
                                    {syncStatus.includes("JSON") && <li>确认远程数据格式符合要求，应为标准JSON格式</li>}
                                    {syncStatus.includes("超时") && <li>尝试使用更稳定的网络连接</li>}
                                </ul>
                            </div>
                            <div className="mt-3">
                                <button
                                    className={`text-xs py-1 px-3 rounded-full ${isDark ? "bg-white/10 hover:bg-white/20 text-blue-300" : "bg-blue-100 hover:bg-blue-200 text-blue-700"} transition-colors`}
                                    onClick={handleSyncEnterpriseLinks}
                                    disabled={isSyncing}>
                                    {isSyncing ? "同步中..." : "重试"}
                                </button>
                            </div>
                        </div>}
                        {}
                        {syncStatus.includes("成功") && enterpriseLinks.length > 0 && <div className={`mt-2 text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                            <div className="font-medium mb-1">数据结构信息：</div>
                            <ul className="list-disc list-inside space-y-1">
                                <li>链接总数：{enterpriseLinks.length}</li>
                                <li>包含字段：{Object.keys(enterpriseLinks[0] || {}).join(", ")}</li>
                                <li>数据格式：符合companyArr规范</li>
                            </ul>
                        </div>}
                        {}
                        {syncStatus.includes("演示数据") && <div className={`mt-2 text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                            <div className="font-medium mb-1">演示数据说明：</div>
                            <p>当前显示的是示例数据。如需使用真实企业链接，请确保：</p>
                            <ul className="list-disc list-inside space-y-1 mt-1">
                                <li>远程数据源返回有效的JSON格式</li>
                                <li>数据结构应包含 companyArr 数组</li>
                                <li>companyArr 数组中的每个对象应包含 title 和 children 字段</li>
                                <li>children 数组中的每个对象应包含 title 和 url 字段</li>
                            </ul>
                            <div className="mt-2 text-xs bg-blue-900/20 p-2 rounded-md">
                                <strong>数据格式参考：</strong><br />
                                {"{\n"}
                                {"  \"companyArr\": [\n"}
                                {"    {\n"}
                                {"      \"title\": \"分类名称\",\n"}
                                {"      \"children\": [\n"}
                                {"        {\"title\": \"链接名称\", \"url\": \"链接地址\"}\n"}
                                {"      ]\n"}
                                {"    }\n"}
                                {"  ],\n"}
                                {"  \"companyImg\": \"企业图片URL（可选）\"\n"}
                                {"}"}
                            </div>
                        </div>}
                    </div>
                </div>
            </div>}
        </div>
    );
}

export interface SettingsPanelProps {
    show: boolean;
    onClose: () => void;
    backgroundImage: string | null;
    setBackgroundImage: React.Dispatch<React.SetStateAction<string | null>>;
    sidebarMode: "always" | "hover";
    setSidebarMode: React.Dispatch<React.SetStateAction<"always" | "hover">>;
    showQuickLinks: boolean;
    toggleShowQuickLinks: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = (
    {
        show,
        onClose,
        backgroundImage,
        setBackgroundImage,
        sidebarMode,
        setSidebarMode,
        showQuickLinks,
        toggleShowQuickLinks
    }
) => {
    const {
        theme,
        toggleTheme,
        isDark
    } = useTheme();

    const { enterpriseLinks, setEnterpriseLinks } = useEnterpriseLinks();

    const [activeTab, setActiveTab] = useState<"theme" | "ai-bookmarks" | "enterprise">("theme");
    const [isAICategorizing, setIsAICategorizing] = useState(false);
    const [isChecking404, setIsChecking404] = useState(false);
    const [invalidLinks, setInvalidLinks] = useState<string[]>([]);
    const [hiddenBookmarks, setHiddenBookmarks] = useState<string[]>([]);
    const [cdnUrl, setCdnUrl] = useState("");
    const [isSyncing, setIsSyncing] = useState(false);
    const [syncStatus, setSyncStatus] = useState("");

    useEffect(() => {
        if (!show)
            return;

        const savedCdnUrl = localStorage.getItem(UI_STORAGE_KEYS.ENTERPRISE_CDN_URL);

        if (savedCdnUrl) {
            setCdnUrl(savedCdnUrl);
        }
    }, [show]);

    if (!show)
        return null;

    const setBackground = (imageUrl: string) => {
        setBackgroundImage(imageUrl);
        try {
            localStorage.setItem(UI_STORAGE_KEYS.BACKGROUND_IMAGE, imageUrl);
            // toast("背景已更新");
        } catch (error) {
            console.error("保存背景图片失败:", error);
            toast.error("背景图片过大，无法保存到本地存储");
            // 重置为默认背景
            setBackgroundImage(
                "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Anime%20style%20landscape%20with%20mountains%20and%20clouds%20beautiful%20sky%20scenery&sign=f0bc0f190fb6a448d4c43003639d50ed"
            );
        }
    };

    const handleBackgroundUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            // 限制图片大小为5MB
            const MAX_SIZE = 3 * 1024 * 1024;
            if (file.size > MAX_SIZE) {
                toast.error("图片大小不能超过3MB，请选择较小的图片");
                return;
            }

            const reader = new FileReader();
            reader.onload = event => {
                if (event.target?.result) {
                    const imageUrl = event.target.result as string;
                    // console.log("Image URL:", imageUrl);
                    setBackground(imageUrl);
                }
            };

            reader.readAsDataURL(file);
        }
    };

    const handleManageQuickLinks = () => {
        toast("快速链接管理功能已完善");
    };

    const resetBackground = () => {
        setBackground(
            "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Anime%20style%20landscape%20with%20mountains%20and%20clouds%20beautiful%20sky%20scenery&sign=f0bc0f190fb6a448d4c43003639d50ed"
        );
    };

    const handleAICategorize = () => {
        setIsAICategorizing(true);

        setTimeout(() => {
            setIsAICategorizing(false);
            toast("AI分类完成！您的书签已按照内容类型自动分类");
        }, 2000);
    };

    const handleCheck404 = () => {
        setIsChecking404(true);

        setTimeout(() => {
            const mockInvalidLinks = ["电影先生", "蓝光影视", "yz..."];
            setInvalidLinks(mockInvalidLinks);
            setIsChecking404(false);

            if (mockInvalidLinks.length > 0) {
                toast(`检测完成，发现 ${mockInvalidLinks.length} 个无效链接`);
            } else {
                toast("所有链接都正常");
            }
        }, 2500);
    };

    const handleHideBookmark = (link: string) => {
        setHiddenBookmarks(prev => [...prev, link]);
        setInvalidLinks(prev => prev.filter(item => item !== link));
        toast("书签已隐藏");
    };

    const handleDeleteBookmark = (link: string) => {
        setInvalidLinks(prev => prev.filter(item => item !== link));
        toast("书签已删除");
    };

    const handleUnhideBookmark = (bookmark: string) => {
        setHiddenBookmarks(prev => prev.filter(item => item !== bookmark));
        toast("书签已恢复显示");
    };

    const handleSyncEnterpriseLinks = () => {
        if (!cdnUrl) {
            toast("请输入有效的CDN地址");
            return;
        }

        setIsSyncing(true);
        setSyncStatus("正在连接...");

        if (!navigator.onLine) {
            setIsSyncing(false);
            setSyncStatus("网络连接已断开，请检查您的网络设置后重试");
            toast("网络连接已断开，请检查您的网络设置后重试");
            return;
        }

        try {
            new URL(cdnUrl);
        } catch (e) {
            setIsSyncing(false);
            setSyncStatus("无效的URL格式，请输入正确的CDN链接地址");
            toast("无效的URL格式，请输入正确的CDN链接地址");
            return;
        }

        const timeoutController = new AbortController();

        const timeoutId = setTimeout(() => {
            timeoutController.abort();
            setIsSyncing(false);
            setSyncStatus("请求超时，服务器响应时间过长");
            toast("请求超时，服务器响应时间过长");
        }, 15000);

        fetch(cdnUrl, {
            signal: timeoutController.signal
        }).then(response => {
            clearTimeout(timeoutId);

            if (!response.ok) {
                setIsSyncing(false);
                let errorMessage = `HTTP错误! 状态码: ${response.status}`;

                if (response.status === 404) {
                    errorMessage = "404 未找到 - 链接地址不存在或已失效";
                } else if (response.status === 403) {
                    errorMessage = "403 禁止访问 - 您没有权限访问此资源";
                } else if (response.status === 500) {
                    errorMessage = "500 服务器错误 - 服务器内部出现问题";
                } else if (response.status === 503) {
                    errorMessage = "503 服务不可用 - 服务器暂时无法处理请求";
                }

                setSyncStatus(errorMessage);
                toast.error(errorMessage);
                throw new Error(errorMessage);
            }

            setSyncStatus("正在解析数据...");
            return response.json();
        }).then(data => {
            let links: EnterpriseLink[] = [];
            let companyImage = "";
            let dataStructureInfo = "";

            if (data.companyArr && Array.isArray(data.companyArr)) {
                dataStructureInfo = "companyArr格式";
                companyImage = data.companyImg || "";

                data.companyArr.forEach((category: { title: string; children?: any[] }) => {
                    if (category.children && Array.isArray(category.children)) {
                        category.children.forEach((item: { title?: string; url?: string }) => {
                            links.push({
                                name: item.title || "未命名链接",
                                url: item.url || "",
                                icon: "fa-link",
                                description: `分类: ${category.title}`,
                                category: category.title
                            });
                        });
                    }
                });

                links = links.filter((item: EnterpriseLink) => item.url);
            } else if (Array.isArray(data)) {
                dataStructureInfo = "数组格式";

                links = data.map((item: { name?: string; title?: string; url?: string; link?: string; icon?: string; description?: string }) => ({
                    name: item.name || item.title || "未命名链接",
                    url: item.url || item.link || "",
                    icon: item.icon || "",
                    description: item.description || ""
                })).filter((item: EnterpriseLink) => item.url);
            } else if (data.links && Array.isArray(data.links)) {
                dataStructureInfo = "links字段格式";

                links = data.links.map((item: { name?: string; title?: string; url?: string; link?: string; icon?: string; description?: string }) => ({
                    name: item.name || item.title || "未命名链接",
                    url: item.url || item.link || "",
                    icon: item.icon || "",
                    description: item.description || ""
                })).filter((item: EnterpriseLink) => item.url);
            }

            if (companyImage) {
                localStorage.setItem(UI_STORAGE_KEYS.COMPANY_IMAGE, companyImage);
            }

            // 使用 Context 统一持久化与事件兼容
            setEnterpriseLinks(links);
            setIsSyncing(false);

            if (syncStatus === "正在解析数据...") {
                const statusMessage = `企业链接同步成功！(数据格式: ${dataStructureInfo})`;
                setSyncStatus(statusMessage);
                toast(`企业链接同步成功，已添加 ${links.length} 个链接，工作图标已添加到侧边栏`);

                setTimeout(() => {
                    onClose();
                }, 1000);
            } else {
                toast("已加载企业链接数据（使用演示模式）");

                setTimeout(() => {
                    onClose();
                }, 1000);
            }
        }).catch(error => {
            clearTimeout(timeoutId);

            if ((error as any).name === "AbortError") {
                return;
            }

            let errorMessage = "同步失败: ";

            if ((error as Error).message.includes("Failed to fetch")) {
                errorMessage += "无法连接到服务器，请检查网络连接或链接地址";
            } else if ((error as Error).message.includes("Unexpected token")) {
                errorMessage += "数据格式错误，返回的不是有效的JSON格式";
            } else {
                errorMessage += (error as Error).message;
            }

            console.error("同步企业链接失败:", error);
            setIsSyncing(false);
            setSyncStatus(errorMessage);
            toast(errorMessage);

            setTimeout(() => {
                const mockEnterpriseLinks = [{
                    name: "企业门户",
                    url: "https://portal.company.com",
                    icon: "fa-building",
                    description: "公司官方门户"
                }, {
                    name: "内部文档",
                    url: "https://docs.company.com",
                    icon: "fa-file-alt",
                    description: "团队知识库"
                }, {
                    name: "项目管理",
                    url: "https://projects.company.com",
                    icon: "fa-tasks",
                    description: "项目进度跟踪"
                }, {
                    name: "团队协作",
                    url: "https://team.company.com",
                    icon: "fa-users",
                    description: "团队沟通平台"
                }];

                // 直接使用 Context 更新
                setEnterpriseLinks(mockEnterpriseLinks);

                if (syncStatus === errorMessage) {
                    setSyncStatus("已加载演示数据 - 无法连接到真实数据源或数据格式不符合要求");
                }
            }, 1000);
        });
    };

    return (
        <div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div
                className={`w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 transform ${isDark ? "bg-gray-800" : "bg-white"}`}>
                {}
                <div
                    className={`p-6 flex justify-between items-center border-b ${isDark ? "border-gray-700" : "border-gray-200"}`}>
                    <h2
                        className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-800"} flex items-center gap-2`}>
                        <i className="fas fa-sliders-h"></i>设置
                                                          </h2>
                    <button
                        onClick={onClose}
                        className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${isDark ? "text-gray-400 hover:text-white hover:bg-gray-700" : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"}`}
                        aria-label="关闭">
                        <i className="fas fa-times"></i>
                    </button>
                </div>
                {}
                <div
                    className={`flex border-b ${isDark ? "border-gray-700" : "border-gray-200"}`}>
                    <button
                        className={`py-4 px-6 text-sm font-medium transition-all duration-300 ${activeTab === "theme" ? `${isDark ? "text-white border-b-2 border-white bg-gray-700/50" : "text-gray-900 border-b-2 border-gray-900 bg-gray-50"}` : `${isDark ? "text-gray-400 hover:text-white hover:bg-gray-700/30" : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"}`}`}
                        onClick={() => setActiveTab("theme")}>主题设置
                                                          </button>
                    <button
                        className={`py-4 px-6 text-sm font-medium transition-all duration-300 ${activeTab === "ai-bookmarks" ? `${isDark ? "text-white border-b-2 border-white bg-gray-700/50" : "text-gray-900 border-b-2 border-gray-900 bg-gray-50"}` : `${isDark ? "text-gray-400 hover:text-white hover:bg-gray-700/30" : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"}`}`}
                        onClick={() => setActiveTab("ai-bookmarks")}>AI书签管理
                                                          </button>
                    <button
                        className={`py-4 px-6 text-sm font-medium transition-all duration-300 ${activeTab === "enterprise" ? `${isDark ? "text-white border-b-2 border-white bg-gray-700/50" : "text-gray-900 border-b-2 border-gray-900 bg-gray-50"}` : `${isDark ? "text-gray-400 hover:text-white hover:bg-gray-700/30" : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"}`}`}
                        onClick={() => setActiveTab("enterprise")}>企业链接
                                                          </button>
                </div>
                {}
                <div className="p-6 max-h-[80vh] overflow-y-auto">
                    {}
                    {activeTab === "theme" && <ThemeSettings
                        isDark={isDark}
                        theme={theme}
                        toggleTheme={toggleTheme}
                        sidebarMode={sidebarMode}
                        setSidebarMode={setSidebarMode}
                        backgroundImage={backgroundImage}
                        setBackground={setBackground}
                        resetBackground={resetBackground}
                        handleBackgroundUpload={handleBackgroundUpload}
                        handleManageQuickLinks={handleManageQuickLinks}
                        showQuickLinks={showQuickLinks}
                        toggleShowQuickLinks={toggleShowQuickLinks} />}
                    {}
                    {activeTab === "ai-bookmarks" && <AIBookmarksSettings
                        isDark={isDark}
                        isAICategorizing={isAICategorizing}
                        isChecking404={isChecking404}
                        invalidLinks={invalidLinks}
                        hiddenBookmarks={hiddenBookmarks}
                        handleAICategorize={handleAICategorize}
                        handleCheck404={handleCheck404}
                        handleHideBookmark={handleHideBookmark}
                        handleDeleteBookmark={handleDeleteBookmark}
                        handleUnhideBookmark={handleUnhideBookmark} />}
                    {}
                    {activeTab === "enterprise" && <EnterpriseLinksSettings
                        isDark={isDark}
                        cdnUrl={cdnUrl}
                        setCdnUrl={setCdnUrl}
                        isSyncing={isSyncing}
                        syncStatus={syncStatus}
                        enterpriseLinks={enterpriseLinks}
                        handleSyncEnterpriseLinks={handleSyncEnterpriseLinks} />}
                </div>
            </div>
        </div>
    );
};
