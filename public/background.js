/* eslint-disable no-undef */
// 响应消息处理器
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // 处理获取书签请求
    if (request.action === 'GET_BOOKMARKS') {
        // 获取完整书签树
        chrome.bookmarks.getTree((bookmarkTreeNodes) => {
            try { 
                if (bookmarkTreeNodes && bookmarkTreeNodes.length > 0) {
                    const root = bookmarkTreeNodes[0];
                    // 默认取书签栏 (通常是 root.children[0])
                    const bookmarksBar = root.children && root.children.length > 0 ? root.children[0] : root;
                    sendResponse({
                        type: 'BOOKMARKS',
                        success: true,
                        payload: bookmarksBar
                    });
                } else {
                    sendResponse({
                        type: 'BOOKMARKS',
                        success: false,
                        error: '书签树为空'
                    });
                }
            } catch (error) {
                console.error('获取书签失败:', error);
                sendResponse({
                    type: 'BOOKMARKS',
                    success: false,
                    error: error.message
                });
            }
        });
        
        return true; // 保持消息通道开启以进行异步响应
    }
    
    // 处理链接检测请求 - 使用 Service Worker 优化方案
    // if (request.action === 'CHECK_LINKS') {
    //     const urls = request.urls || [];
        
    //     if (!Array.isArray(urls) || urls.length === 0) {
    //         sendResponse({
    //             success: false,
    //             error: '无效的URL列表'
    //         });
    //         return true;
    //     }

    //     // 并发控制：每次最多同时检测 10 个链接，避免浏览器限制
    //     const CONCURRENT_LIMIT = 10;
    //     const TIMEOUT_MS = 8000; // 8秒超时
    //     const invalidLinks = [];
    //     let completedCount = 0;
    //     let currentIndex = 0;

    //     // 检测单个链接的函数
    //     const checkSingleLink = async (url) => {
    //         const controller = new AbortController();
    //         const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    //         try {
    //             // 策略1: 尝试 HEAD 请求（最轻量，某些服务器不支持）
    //             try {
    //                 const headResponse = await fetch(url, {
    //                     method: 'HEAD',
    //                     mode: 'cors',
    //                     cache: 'no-cache',
    //                     redirect: 'follow',
    //                     credentials: 'omit',
    //                     referrer: 'no-referrer',
    //                     signal: controller.signal
    //                 });
                    
    //                 clearTimeout(timeoutId);
    //                 const status = headResponse.status;
                    
    //                 // 2xx-3xx 表示有效，4xx-5xx 表示无效
    //                 if (status >= 200 && status < 400) {
    //                     return { url, valid: true, status, method: 'HEAD' };
    //                 } else {
    //                     return { url, valid: false, status, error: `HTTP ${status}`, method: 'HEAD' };
    //                 }
    //             } catch (headError) {
    //                 // HEAD 失败，继续尝试 GET
    //                 if (headError.name === 'AbortError') {
    //                     throw new Error('请求超时');
    //                 }
    //             }

    //             // 策略2: 尝试 GET 请求（CORS 模式）
    //             try {
    //                 const getResponse = await fetch(url, {
    //                     method: 'GET',
    //                     mode: 'cors',
    //                     cache: 'no-cache',
    //                     redirect: 'follow',
    //                     credentials: 'omit',
    //                     referrer: 'no-referrer',
    //                     signal: controller.signal
    //                 });
                    
    //                 clearTimeout(timeoutId);
    //                 const status = getResponse.status;
                    
    //                 if (status >= 200 && status < 400) {
    //                     return { url, valid: true, status, method: 'GET' };
    //                 } else {
    //                     return { url, valid: false, status, error: `HTTP ${status}`, method: 'GET' };
    //                 }
    //             } catch (getError) {
    //                 // GET CORS 失败，可能是 CORS 问题，尝试 no-cors
    //                 if (getError.name === 'AbortError') {
    //                     throw new Error('请求超时');
    //                 }
    //             }

    //             // 策略3: 使用 no-cors 模式（无法读取状态码，但能判断是否可访问）
    //             try {
    //                 const noCorsResponse = await fetch(url, {
    //                     method: 'GET',
    //                     mode: 'no-cors',
    //                     cache: 'no-cache',
    //                     redirect: 'follow',
    //                     credentials: 'omit',
    //                     referrer: 'no-referrer',
    //                     signal: controller.signal
    //                 });
                    
    //                 clearTimeout(timeoutId);
                    
    //                 // no-cors 模式下，如果请求成功（没有抛出异常），说明链接至少可以访问
    //                 // 但无法读取状态码，所以保守地认为可能有效
    //                 // 注意：no-cors 模式下 response.ok 和 response.status 不可用
    //                 return { url, valid: true, status: 'unknown (no-cors)', method: 'GET (no-cors)' };
    //             } catch (noCorsError) {
    //                 clearTimeout(timeoutId);
                    
    //                 // no-cors 也失败，说明链接确实无法访问
    //                 if (noCorsError.name === 'AbortError') {
    //                     return { url, valid: false, error: '请求超时', method: 'timeout' };
    //                 }
    //                 return { url, valid: false, error: noCorsError.message || '无法访问', method: 'all failed' };
    //             }

    //         } catch (error) {
    //             clearTimeout(timeoutId);
    //             return { 
    //                 url, 
    //                 valid: false, 
    //                 error: error.message || '未知错误', 
    //                 method: 'error' 
    //             };
    //         }
    //     };

    //     // 并发控制执行检测
    //     const runBatch = async () => {
    //         const batch = [];
    //         const endIndex = Math.min(currentIndex + CONCURRENT_LIMIT, urls.length);

    //         for (let i = currentIndex; i < endIndex; i++) {
    //             batch.push(
    //                 checkSingleLink(urls[i])
    //                     .then((result) => {
    //                         if (!result.valid) {
    //                             invalidLinks.push(result.url);
    //                         }
    //                         completedCount++;
                            
    //                         // 发送进度更新（可选，避免过于频繁）
    //                         if (completedCount % 5 === 0 || completedCount === urls.length) {
    //                             chrome.runtime.sendMessage({
    //                                 type: 'CHECK_LINKS_PROGRESS',
    //                                 completed: completedCount,
    //                                 total: urls.length,
    //                                 invalidCount: invalidLinks.length
    //                             }).catch(() => {
    //                                 // 忽略发送失败（可能没有监听器）
    //                             });
    //                         }
    //                     })
    //                     .catch((error) => {
    //                         console.error(`检测链接失败: ${urls[i]}`, error);
    //                         invalidLinks.push(urls[i]);
    //                         completedCount++;
    //                     })
    //             );
    //         }

    //         await Promise.all(batch);
    //         currentIndex = endIndex;

    //         // 如果还有未处理的链接，继续下一批
    //         if (currentIndex < urls.length) {
    //             await runBatch();
    //         } else {
    //             // 所有检测完成，发送最终结果
    //             sendResponse({
    //                 success: true,
    //                 invalidLinks: invalidLinks,
    //                 totalChecked: urls.length,
    //                 invalidCount: invalidLinks.length
    //             });
    //         }
    //     };

    //     // 开始检测
    //     runBatch().catch((error) => {
    //         sendResponse({
    //             success: false,
    //             error: error.message || '检测过程中发生错误'
    //         });
    //     });

    //     // 返回 true 表示异步响应
    //     return true;
    // }
    
    // return false;
});
