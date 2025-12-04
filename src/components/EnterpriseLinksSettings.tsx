import { EnterpriseLinksSettingsProps } from "@/types";

export const EnterpriseLinksSettings: React.FC<EnterpriseLinksSettingsProps> = (
  {
    isDark,
    cdnUrl,
    setCdnUrl,
    isSyncing,
    syncStatus,
    enterpriseLinks,
    handleSyncEnterpriseLinks
  }
) => {
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
                            localStorage.setItem("enterpriseCdnUrl", value);
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
};