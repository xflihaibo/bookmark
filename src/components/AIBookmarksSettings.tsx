import { AIBookmarksSettingsProps } from "@/types";

export const AIBookmarksSettings: React.FC<AIBookmarksSettingsProps> = (
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
  }
) => {
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
};