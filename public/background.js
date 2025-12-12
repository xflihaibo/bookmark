/* eslint-disable no-undef */
// 响应消息处理器
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // 处理获取书签请求
    if (request.action === 'GET_BOOKMARKS') {
        // 获取完整书签树
        chrome.bookmarks.getTree((bookmarkTreeNodes) => {
            try { 
                // 书签树的根是一个数组，通常第一个元素就是整个书签的根
                if (bookmarkTreeNodes && bookmarkTreeNodes.length > 0) {
                    const root = bookmarkTreeNodes[0];
                    // 发送书签数据给请求方
                    sendResponse({
                        type: 'BOOKMARKS',
                        success: true,
                        payload: root.children[0]
                    });

                    chrome.runtime.sendMessage({
                        type: 'BOOKMARKS',
                        payload: root.children[0]
                    });

                } else {
                    sendResponse({
                        type: 'BOOKMARKS',
                        success: false,
                        error: '书签树为空'
                    });
                }
            } catch (error) {
                sendResponse({
                    type: 'BOOKMARKS',
                    success: false,
                    error: error.message
                });
            }
        });
        
        return true;
    }
    
    return false;
});
